using System;
using System.Net;
using System.Net.Mail;

namespace EmailTest // This should match the folder structure, or you can change it to match the desired namespace
{
    class Program
    {
        static void Main()
        {
            try
            {
                string fromEmail = "nbi98989898@gmail.com"; // Your test Gmail
                string password = "gpgp qyjh akzz mpbd"; // Your Gmail app password
                string toEmail = "ydg886@gmail.com"; // Your personal email to receive the test

                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(fromEmail);
                mail.To.Add(toEmail);
                mail.Subject = "SMTP Test Email";
                mail.Body = "This is a test email from your SMTP setup.";

                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(fromEmail, password),
                    EnableSsl = true
                };

                smtp.Send(mail);
                Console.WriteLine("✅ Email sent successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error sending email: " + ex.Message);
            }
        }
    }
}
