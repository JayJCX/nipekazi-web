const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Missing Supabase credentials in ../.env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let globalSock = null;
let isSupabaseListening = false;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    // Setting printQRInTerminal to true natively renders the QR code.
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        // Suppress massive log output from baileys
        logger: require('pino')({ level: 'silent' }),
        // Make connection lighter and less prone to 515 stream errors
        browser: ['NipeKazi', 'Chrome', '10.15.7'],
        syncFullHistory: false,
        markOnlineOnConnect: false
    });

    globalSock = sock;

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log("\n=========================================");
            console.log("SCAN THE QR CODE BELOW WITH WHATSAPP📱");
            console.log("=========================================\n");
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log(`Connection closed. Status code: ${statusCode}. Reconnecting: ${shouldReconnect}`);
            if (lastDisconnect.error) {
                console.error("Disconnect Error:", lastDisconnect.error);
            }
            
            // CRITICAL FIX: Destroy the old socket so it stops writing to the auth folder and corrupting it!
            if (globalSock) {
                globalSock.ev.removeAllListeners();
            }

            if (shouldReconnect) {
                console.log("Waiting 3 seconds for network to stabilize before reconnecting...");
                setTimeout(() => startBot(), 3000); 
            } else {
                console.log("❌ SESSION LOGGED OUT. You must delete auth_info_baileys and scan a new QR code.");
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp connection opened successfully!');
            if (!isSupabaseListening) {
                listenToSupabase();
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

function listenToSupabase() {
    console.log("📡 Subscribing to Supabase tables...");
    isSupabaseListening = true;
    
    // Combine all listeners into a SINGLE channel to prevent connection drops/limits
    const channel = supabase.channel('nipekazi-global-channel');

    channel
        // 1. Listen for New Jobs (INSERT)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jobs' }, async (payload) => {
            console.log("🔥 NEW JOB POSTED!", payload.new.title);
            const newJob = payload.new;
            
            const { data: freelancers, error } = await supabase.from('profiles').select('phone_number, full_name').eq('role', 'freelancer');
            if (error) return console.error("Error fetching freelancers", error);
            
            const messageText = `*🚨 NipeKazi Job Alert!*\n\n*${newJob.title}*\n*Type:* ${newJob.job_type}\n*Location:* ${newJob.location}\n*Budget:* TZS ${newJob.budget}\n\n*Description:*\n${newJob.description}\n\n👉 _Log in to apply:_ https://nipekazi-web-atfa.vercel.app/login`;
            
            console.log(`Sending alerts to ${freelancers.length} freelancers...`);
            for (const f of freelancers) {
                if (!f.phone_number) continue;
                let num = f.phone_number.replace(/\D/g, '');
                if (num.startsWith('0')) num = '255' + num.substring(1);
                else if (!num.startsWith('255')) num = '255' + num;
                
                const jid = `${num}@s.whatsapp.net`;
                try {
                    await globalSock.onWhatsApp(jid); // Fetch encryption keys
                    await globalSock.sendMessage(jid, { text: messageText });
                    console.log(`[Sent] Alert to ${f.full_name} (${jid})`);
                } catch (e) { 
                    console.error(`[Failed] to send to ${jid}. Error:`, e.message || e); 
                }
            }
        })
        // 2. Listen for New Applications (INSERT)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'applications' }, async (payload) => {
            console.log("🔥 NEW APPLICATION SUBMITTED!", payload.new.id);
            const { data: freelancer } = await supabase.from('profiles').select('full_name').eq('id', payload.new.freelancer_id).single();
            const { data: job } = await supabase.from('jobs').select('employer_id, title').eq('id', payload.new.job_id).single();
            
            if (!job) return;

            const { data: employer } = await supabase.from('profiles').select('phone_number, full_name').eq('id', job.employer_id).single();

            if (!employer?.phone_number) return;

            let num = employer.phone_number.replace(/\D/g, '');
            if (num.startsWith('0')) num = '255' + num.substring(1);
            else if (!num.startsWith('255')) num = '255' + num;
            const jid = `${num}@s.whatsapp.net`;

            const msg = `*📢 New Application Received!*\n\nHi ${employer.full_name}, ${freelancer?.full_name || 'Someone'} has just applied for your job: *${job.title}*.\n\n👉 _Log in to review and hire:_ https://nipekazi-web-atfa.vercel.app/dashboard/applications`;

            try { 
                await globalSock.onWhatsApp(jid); // Fetch encryption keys
                await globalSock.sendMessage(jid, { text: msg }); 
                console.log(`[Sent] Employer Alert to ${jid}`); 
            } catch (e) { console.error(`[Failed] to send to ${jid}`); }
        })
        // 3. Listen for Hired/Rejected Applications (UPDATE)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'applications' }, async (payload) => {
            if (payload.new.status === 'Hired' && payload.old?.status !== 'Hired') {
                console.log("🎉 FREELANCER HIRED!", payload.new.id);
                
                const { data: appData } = await supabase.from('applications').select('freelancer_id, job_id').eq('id', payload.new.id).single();
                if (!appData) return;

                const { data: freelancer } = await supabase.from('profiles').select('phone_number, full_name').eq('id', appData.freelancer_id).single();
                const { data: job } = await supabase.from('jobs').select('title').eq('id', appData.job_id).single();

                if (!freelancer?.phone_number || !job) return;

                let num = freelancer.phone_number.replace(/\D/g, '');
                if (num.startsWith('0')) num = '255' + num.substring(1);
                else if (!num.startsWith('255')) num = '255' + num;
                const jid = `${num}@s.whatsapp.net`;

                const msg = `*🎉 CONGRATULATIONS ${freelancer.full_name}!*\n\nYou have been HIRED for the job: *${job.title}*\n\n👉 _Log in to view your contract and chat with the employer:_ https://nipekazi-web-atfa.vercel.app/dashboard/contracts`;

                try { 
                    await globalSock.onWhatsApp(jid); 
                    await globalSock.sendMessage(jid, { text: msg }); 
                    console.log(`[Sent] Hired Alert to ${freelancer.full_name} (${jid})`); 
                } catch (e) { console.error(`[Failed] to send to ${jid}`); }
            
            } else if (payload.new.status === 'Rejected' && payload.old?.status !== 'Rejected') {
                console.log("❌ FREELANCER REJECTED!", payload.new.id);
                
                const { data: appData } = await supabase.from('applications').select('freelancer_id, job_id').eq('id', payload.new.id).single();
                if (!appData) return;

                const { data: freelancer } = await supabase.from('profiles').select('phone_number, full_name').eq('id', appData.freelancer_id).single();
                const { data: job } = await supabase.from('jobs').select('title').eq('id', appData.job_id).single();

                if (!freelancer?.phone_number || !job) return;

                let num = freelancer.phone_number.replace(/\D/g, '');
                if (num.startsWith('0')) num = '255' + num.substring(1);
                else if (!num.startsWith('255')) num = '255' + num;
                const jid = `${num}@s.whatsapp.net`;

                const msg = `*❌ Application Update*\n\nHi ${freelancer.full_name}, unfortunately your application for the job *${job.title}* was not accepted this time. Keep applying to other jobs! 💪`;
                try { 
                    await globalSock.onWhatsApp(jid);
                    await globalSock.sendMessage(jid, { text: msg }); 
                    console.log(`[Sent] Reject Alert to ${jid}`); 
                } catch (e) { console.error(`[Failed] to send to ${jid}`); }
            } else if (payload.new.status === 'Pending' && payload.old?.status === 'Canceled') {
                console.log("🔥 FREELANCER RE-APPLIED!", payload.new.id);
                
                const { data: appData } = await supabase.from('applications').select('freelancer_id, job_id').eq('id', payload.new.id).single();
                if (!appData) return;

                const { data: freelancer } = await supabase.from('profiles').select('full_name').eq('id', appData.freelancer_id).single();
                const { data: job } = await supabase.from('jobs').select('employer_id, title').eq('id', appData.job_id).single();
                
                if (!job) return;

                const { data: employer } = await supabase.from('profiles').select('phone_number, full_name').eq('id', job.employer_id).single();

                if (!employer?.phone_number) return;

                let num = employer.phone_number.replace(/\D/g, '');
                if (num.startsWith('0')) num = '255' + num.substring(1);
                else if (!num.startsWith('255')) num = '255' + num;
                const jid = `${num}@s.whatsapp.net`;

                const msg = `*📢 Application Re-activated!*\n\nHi ${employer.full_name}, ${freelancer?.full_name || 'Someone'} has just RE-APPLIED for your job: *${job.title}*.\n\n👉 _Log in to review and hire:_ https://nipekazi-web-atfa.vercel.app/dashboard/applications`;

                try { 
                    await globalSock.onWhatsApp(jid);
                    await globalSock.sendMessage(jid, { text: msg }); 
                    console.log(`[Sent] Employer Alert to ${jid}`); 
                } catch (e) { console.error(`[Failed] to send to ${jid}`); }
            }
        })
        // 4. Listen for Terminated Contracts (UPDATE)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contracts' }, async (payload) => {
            if (payload.new.status === 'Terminated' && payload.old?.status !== 'Terminated') {
                console.log("💔 CONTRACT TERMINATED!", payload.new.id);
                
                const { data: contractData } = await supabase.from('contracts').select('freelancer_id, job_id').eq('id', payload.new.id).single();
                if (!contractData) return;

                const { data: freelancer } = await supabase.from('profiles').select('phone_number, full_name').eq('id', contractData.freelancer_id).single();
                const { data: job } = await supabase.from('jobs').select('title').eq('id', contractData.job_id).single();

                if (!freelancer?.phone_number || !job) return;

                let num = freelancer.phone_number.replace(/\D/g, '');
                if (num.startsWith('0')) num = '255' + num.substring(1);
                else if (!num.startsWith('255')) num = '255' + num;
                const jid = `${num}@s.whatsapp.net`;

                const msg = `*💔 Contract Terminated*\n\nHi ${freelancer.full_name}, your contract for the job *${job.title}* has been terminated by the employer.\n\n👉 _Log in to view details:_ https://nipekazi-web-atfa.vercel.app/dashboard/contracts`;

                try { 
                    await globalSock.onWhatsApp(jid);
                    await globalSock.sendMessage(jid, { text: msg }); 
                    console.log(`[Sent] Terminate Alert to ${jid}`); 
                } catch (e) { console.error(`[Failed] to send to ${jid}`); }
            }
        })
        // 5. Listen for Admin Warnings (INSERT)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_messages' }, async (payload) => {
            console.log("⚠️ ADMIN WARNING TRIGGERED!", payload.new.id);
            
            const { data: user } = await supabase.from('profiles').select('phone_number, full_name').eq('id', payload.new.target_user_id).single();
            if (!user?.phone_number) return;

            let num = user.phone_number.replace(/\D/g, '');
            if (num.startsWith('0')) num = '255' + num.substring(1);
            else if (!num.startsWith('255')) num = '255' + num;
            const jid = `${num}@s.whatsapp.net`;

            try { 
                await globalSock.onWhatsApp(jid);
                await globalSock.sendMessage(jid, { text: payload.new.message }); 
                console.log(`[Sent] Admin Warning to ${user.full_name} (${jid})`); 
            } catch (e) { console.error(`[Failed] to send to ${jid}`); }
        })
        .subscribe((status) => {
            console.log("Supabase Contracts Realtime Status:", status);
        });
}

startBot();
