import { Linkedin, Twitter, Send, Github, BookOpen } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Linkedin className="w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/0xaakibalam/",
      label: "LinkedIn Profile"
    },
    {
      icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      text: "X",
      href: "https://x.com/0xAakibAlam",
      label: "X (Twitter) Profile"
    },
    {
      icon: <Github className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      text: "GitHub",
      href: "https://github.com/0xAakibAlam",
      label: "GitHub Repository"
    },
    {
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      text: "Docs",
      href: "/docs",
      label: "Documentation"
    },
    {
      icon: <Send className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
      text: "Join our Telegram for support and feedback",
      href: "https://t.me/AnonQA_Official",
      label: "Telegram Community"
    }
  ];

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="py-6 sm:py-8">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 sm:p-3 rounded-md hover:bg-muted flex items-center gap-2 sm:gap-3"
                aria-label={link.label}
              >
                {link.icon}
                <span className="text-xs sm:text-sm md:text-xl">{link.text}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 