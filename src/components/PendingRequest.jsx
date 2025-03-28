// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { UserCheck, UserX, Bell } from "lucide-react";

// const PendingRequest = () => {
//   const token = localStorage.getItem("token");
//   const [requests, setRequests] = useState([]);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await axios.get(
//           "https://web-chat-application-a0f4.onrender.com/api/auth/friend-requests/pending/",
//           {
//             headers: { Authorization: `Token ${token}` },
//           }
//         );
//         setRequests(response.data);
//       } catch (error) {
//         console.error(
//           "Error fetching requests:",
//           error.response?.data || error.message
//         );
//       }
//     };

//     if (token) {
//       fetchRequests();
//     }
//   }, [token]);

//   const handleAccept = async (requestId, fromUserId) => {
//     try {
//       await axios.patch(
//         `https://web-chat-application-a0f4.onrender.com/api/auth/friend-requests/accept/${requestId}/`,
//         {},
//         {
//           headers: { Authorization: `Token ${token}` },
//         }
//       );

//       setRequests((prev) => prev.filter((req) => req.id !== requestId));
//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === fromUserId ? { ...user, is_friend: true } : user
//         )
//       );
//     } catch (error) {
//       console.error("Accept error:", error.response?.data || error.message);
//     }
//   };

//   const handleReject = async (requestId) => {
//     try {
//       await axios.patch(
//         `https://web-chat-application-a0f4.onrender.com/api/auth/friend-requests/reject/${requestId}/`,
//         {},
//         {
//           headers: { Authorization: `Token ${token}` },
//         }
//       );
//       setRequests(requests.filter((req) => req.id !== requestId));
//     } catch (error) {
//       console.error("Reject error:", error.response?.data || error.message);
//     }
//   };

//   if (requests.length === 0) {
//     return null;
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4 mb-4">
//       <div className="flex items-center space-x-2 mb-4">
//         <Bell className="w-5 h-5 text-[#075E54]" />
//         <h2 className="text-lg font-semibold text-gray-800">Friend Requests</h2>
//         {requests.length > 0 && (
//           <span className="bg-[#075E54] text-white text-xs px-2 py-1 rounded-full">
//             {requests.length}
//           </span>
//         )}
//       </div>

//       <div className="space-y-3">
//         {requests.map((request) => (
//           <div
//             key={request.id}
//             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white font-semibold">
//                 {request.from_user.username[0].toUpperCase()}
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-900">
//                   {request.from_user.username}
//                 </h3>
//                 <p className="text-xs text-gray-500">
//                   Wants to connect with you
//                 </p>
//               </div>
//             </div>

//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handleAccept(request.id, request.from_user.id)}
//                 className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
//                 title="Accept"
//               >
//                 <UserCheck className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => handleReject(request.id)}
//                 className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
//                 title="Reject"
//               >
//                 <UserX className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PendingRequest;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { UserCheck, UserX, Bell } from "lucide-react";
import { gsap } from "gsap";

const PendingRequest = () => {
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://web-chat-application-a0f4.onrender.com/api/auth/friend-requests/pending/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error(
          "Error fetching requests:",
          error.response?.data || error.message
        );
      }
    };

    if (token) {
      fetchRequests();
    }
  }, [token]);

  useEffect(() => {
    if (requests.length > 0) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  }, [requests]);

  const handleAccept = async (requestId, fromUserId) => {
    try {
      await axios.patch(
        `https://web-chat-application-a0f4.onrender.com/api/auth/friend-requests/accept/${requestId}/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Accept error:", error.response?.data || error.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.patch(
        `https://web-chat-application-a0f4.onrender.com/api/auth/friend-requests/reject/${requestId}/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Reject error:", error.response?.data || error.message);
    }
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="rounded-lg shadow-md p-4 mb-4"
      style={{
        background: "linear-gradient(135deg, #f0f4f8, #d9e4f5)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-[#075E54]" />
        <h2 className="text-lg font-semibold text-gray-800">Friend Requests</h2>
        {requests.length > 0 && (
          <span className="bg-[#075E54] text-white text-xs px-2 py-1 rounded-full">
            {requests.length}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {requests.map((request, index) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-3 bg-white bg-opacity-70 backdrop-blur rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            style={{
              border: "1px solid #e0e0e0",
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#075E54] rounded-full flex items-center justify-center text-white font-semibold shadow-inner">
                {request.from_user.username[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {request.from_user.username}
                </h3>
                <p className="text-xs text-gray-500">
                  Wants to connect with you
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleAccept(request.id, request.from_user.id)}
                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200"
                title="Accept"
              >
                <UserCheck className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                title="Reject"
              >
                <UserX className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequest;
