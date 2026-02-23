import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import ServiceDetails from "@/pages/ServiceDetails";
import Auth from "@/pages/Auth";
import UserProfile from "@/pages/UserProfile";
import Planner from "@/pages/Planner";
import Checkout from "@/pages/Checkout";
import VendorDashboard from "@/pages/VendorDashboard";
import Contact from "@/pages/Contact";
function Router() {
    const [location] = useLocation();
    const isVendorDashboard = location.startsWith("/vendor-dashboard");
    if (isVendorDashboard) {
        return (<Switch>
        <Route path="/vendor-dashboard" component={VendorDashboard}/>
        <Route component={NotFound}/>
      </Switch>);
    }
    return (<div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Switch>
          <Route path="/" component={Home}/>
          <Route path="/services" component={Services}/>
          <Route path="/services/:id" component={ServiceDetails}/>
          <Route path="/auth" component={Auth}/>
          <Route path="/user-profile" component={UserProfile}/>
          <Route path="/planner" component={Planner}/>
          <Route path="/checkout" component={Checkout}/>
          <Route path="/contact" component={Contact}/>
          <Route component={NotFound}/>
        </Switch>
      </main>
      <Footer />
    </div>);
}
function App() {
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>);
}
export default App;
