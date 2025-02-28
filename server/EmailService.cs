using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System;
using MailKit.Security;

namespace server
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendEmail(string recipientEmail, string subject, string body)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(smtpSettings["Username"])); // sender email
            email.To.Add(MailboxAddress.Parse(recipientEmail)); // recipient email
            email.Subject = subject;

            // Send as HTML
            email.Body = new TextPart("html")
            {
                Text = body
            };

            try
            {
                using (var smtpClient = new SmtpClient())
                {
                    // Connect with STARTTLS
                    smtpClient.Connect(smtpSettings["Host"], int.Parse(smtpSettings["Port"]), SecureSocketOptions.StartTls); // Ensure TLS/SSL is used
                    smtpClient.Authenticate(smtpSettings["Username"], smtpSettings["Password"]);
                    smtpClient.Send(email);
                    smtpClient.Disconnect(true);
                }

                Console.WriteLine("Email sent successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }
    }
}