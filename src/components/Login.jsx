// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { MessageSquare, User, Lock, AlertCircle, Loader } from "lucide-react";

// const Login = () => {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const { username, password } = formData;
//   const navigate = useNavigate();

//   useEffect(() => {
//     setTimeout(() => setPageLoading(false), 1500); // Simulate page loading
//   }, []);

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.post(
//         "https://web-chat-application-a0f4.onrender.com/api/auth/login/",
//         {
//           username,
//           password,
//         }
//       );
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user_id", res.data.user.id.toString());
//       localStorage.setItem("username", res.data.user.username);
//       setPageLoading(true);
//       navigate("/");
//     } catch (err) {
//       console.error("API Error:", err);
//       setError("Invalid username or password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (pageLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
//         <Loader className="w-12 h-12 animate-spin text-[#075E54]" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo and Title */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#075E54] text-white mb-4">
//             <MessageSquare className="w-8 h-8" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
//           <p className="text-gray-600 mt-2">Sign in to continue to Chat</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start">
//               <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={onSubmit} className="space-y-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <User className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 name="username"
//                 value={username}
//                 onChange={onChange}
//                 required
//                 className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075E54] focus:border-transparent transition duration-200"
//               />
//             </div>

//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 value={password}
//                 onChange={onChange}
//                 required
//                 className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075E54] focus:border-transparent transition duration-200"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-[#075E54] text-white py-2.5 rounded-lg hover:bg-[#054c44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#075E54] transition duration-200 font-medium flex items-center justify-center"
//               disabled={loading}
//             >
//               {loading ? (
//                 <Loader className="w-5 h-5 animate-spin" />
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Sign Up Link */}
//         <p className="text-center mt-6 text-gray-600">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-[#075E54] font-medium hover:text-[#054c44] transition duration-200"
//           >
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, User, Lock, AlertCircle, Loader } from "lucide-react";
import { gsap } from "gsap";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { username, password } = formData;
  const navigate = useNavigate();

  const formRef = useRef();
  const titleRef = useRef();
  const loaderRef = useRef();

  useEffect(() => {
    // Loader animation (2s)
    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!pageLoading) {
      gsap.from(titleRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    }
  }, [pageLoading]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "https://web-chat-application-a0f4.onrender.com/api/auth/login/",
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user.id.toString());
      localStorage.setItem("username", res.data.user.username);

      // ✅ Trigger page loader again
      setPageLoading(true);

      // ✅ Delay before navigating (e.g., 2 seconds)
      setTimeout(() => {
        navigate("/");
      }, 2000); // same as initial loader time
    } catch (err) {
      console.error("API Error:", err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  // Beautiful Loader
  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] relative overflow-hidden">
        <div ref={loaderRef} className="relative z-10">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-12 h-12 text-[#075E54] animate-bounce" />
            <h2 className="text-2xl font-bold text-[#075E54]">
              Loading Chat...
            </h2>
          </div>
        </div>
        {/* Background circles animation */}
        <div className="absolute w-72 h-72 bg-[#075E54]/20 rounded-full animate-ping"></div>
        <div className="absolute w-96 h-96 bg-[#075E54]/10 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Title */}
        <div className="text-center mb-8" ref={titleRef}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#075E54] text-white mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue to Chat</p>
        </div>

        {/* Login Form */}
        <div ref={formRef}>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start shadow">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={onChange}
                required
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075E54] focus:border-transparent transition duration-200 shadow-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#075E54] focus:border-transparent transition duration-200 shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#075E54] text-white py-3 rounded-lg hover:bg-[#054c44] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#075E54] transition duration-200 font-medium flex items-center justify-center shadow-md"
              disabled={loading}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#075E54] font-medium hover:text-[#054c44] transition duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
