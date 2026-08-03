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

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    // Setting printQRInTerminal to true natively renders the QR code.
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        // Suppress massive log output from baileys
        logger: require('pino')({ level: 'silent' })
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log("\n=========================================");
            console.log("SCAN THE QR CODE BELOW WITH WHATSAPP📱");
            console.log("=========================================\n");
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp connection opened successfully!');
            listenToSupabase(sock);
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

function listenToSupabase(sock) {
    console.log("📡 Subscribing to Supabase jobs table...");
    
    supabase
        .channel('jobs-insert-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jobs' }, async (payload) => {
            console.log("🔥 NEW JOB POSTED!", payload.new.title);
            const newJob = payload.new;
            
            // Fetch all freelancers
            const { data: freelancers, error } = await supabase
                .from('profiles')
                .select('phone_number, full_name')
                .eq('role', 'freelancer');
                
            if (error) {
                console.error("Error fetching freelancers", error);
                return;
            }
            
            const messageText = `*🚨 NipeKazi Job Alert!*\n\n*${newJob.title}*\n*Type:* ${newJob.job_type}\n*Location:* ${newJob.location}\n*Budget:* TZS ${newJob.budget}\n\n*Description:*\n${newJob.description}\n\n👉 _Log in to apply:_ https://nipekazi-web-atfa.vercel.app/login`;
            
            console.log(`Sending alerts to ${freelancers.length} freelancers...`);
            
            for (const f of freelancers) {
                if (!f.phone_number) continue;
                
                // Format phone number to WhatsApp JID format
                let num = f.phone_number.replace(/\D/g, ''); // strip non-digits
                
                // Extremely basic formatting for MVP (Tanzanian context)
                if (num.startsWith('0')) {
                    num = '255' + num.substring(1);
                } else if (!num.startsWith('255')) {
                    num = '255' + num;
                }
                
                const jid = `${num}@s.whatsapp.net`;
                
                try {
                    await sock.sendMessage(jid, { text: messageText });
                    console.log(`[Sent] Alert to ${f.full_name} (${jid})`);
                } catch (e) {
                    console.error(`[Failed] to send to ${jid}`);
                }
            }
        })
        .subscribe((status) => {
            console.log("Supabase Realtime Status:", status);
        });
}

startBot();
