import React from 'react';
import { Factory } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from '@/components/navbar';

// Navbar Component
// const Navbar = () => {
//   return (
//     <nav className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <Factory className="h-8 w-8 text-teal-600" />
//             <span className="ml-2 text-2xl font-bold text-gray-800">Crowdfundify</span>
//           </div>
//           <div className="hidden md:flex items-center space-x-8">
//             {['Home', 'About', 'Services', 'Contact'].map((item) => (
//               <a
//                 key={item}
//                 href="#"
//                 className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//               >
//                 {item}
//               </a>
//             ))}
//           </div>
//           <div>
//             <Link href="/signup">
//             <Button className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg px-6 py-2.5 text-sm font-semibold">
//               Sign Up
//             </Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow w-full">{children}</main>
    </div>
  );
}
