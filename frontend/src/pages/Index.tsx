
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { AuthModal } from "../components/auth/AuthModal";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const handleAuthAction = (tab: "login" | "register") => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setAuthTab(tab);
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="flex flex-col min-h-screen">
        {/* Hero Section - Simplified */}
        <section className="hero-gradient py-20 px-4 text-center text-white flex items-center justify-center flex-1">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Academic Project Management
            </h1>
            <p className="text-lg md:text-xl mb-10 opacity-90 animate-fade-in" style={{ animationDelay: "200ms" }}>
              Connect students and mentors, manage academic projects with ease. Streamline collaboration, track progress, 
              and achieve better results together.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-academe-700 hover:bg-gray-100 hover:text-academe-800 px-8 py-6 text-lg w-64"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => handleAuthAction("login")}
                    className="bg-white text-academe-700 hover:bg-gray-100 hover:text-academe-800 px-8 py-6 text-lg w-64 font-medium"
                  >
                    Login
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => handleAuthAction("register")}
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg w-64 font-medium"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 px-4 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Academe</h3>
                <p className="text-sm text-muted-foreground">
                  A comprehensive platform for academic project collaboration, bringing students and mentors together.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-muted-foreground hover:text-academe-500">Home</a></li>
                  <li><a href="/about" className="text-muted-foreground hover:text-academe-500">About</a></li>
                  <li><a href="/contact" className="text-muted-foreground hover:text-academe-500">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email: info@academe-collab.com
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone: +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Academe. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen} 
        defaultTab={authTab}
      />
    </>
  );
};

export default Index;
