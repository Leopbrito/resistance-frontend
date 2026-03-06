import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { GlowButton } from "../components/GlowButton";
import { ParticleBackground } from "../components/ParticleBackground";
import { ArrowLeft } from "lucide-react";

export function JoinRoomScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCreateMode = searchParams.get("mode") === "create";

  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate("/lobby");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F14] overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 min-h-screen px-6 py-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#00D9FF] transition-colors mb-12"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-['Inter']">Back</span>
        </motion.button>

        <div className="flex flex-col items-center pt-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-['Orbitron'] text-3xl mb-12 text-center tracking-wider text-white"
          >
            {isCreateMode ? "CREATE ROOM" : "JOIN ROOM"}
          </motion.h2>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-8"
          >
            {/* Username Input */}
            <div className="space-y-3">
              <label
                htmlFor="username"
                className="block font-['Inter'] text-[#9CA3AF] text-sm tracking-wide uppercase"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-5 py-4 bg-[#1A1F28] border-2 border-[#6B7280] rounded-lg
                  text-white font-['Inter'] placeholder-[#6B7280]
                  focus:border-[#00D9FF] focus:outline-none focus:shadow-[0_0_20px_rgba(0,217,255,0.3)]
                  transition-all duration-300"
              />
            </div>

            {/* Room Code Input (only for join mode) */}
            {!isCreateMode && (
              <div className="space-y-3">
                <label
                  htmlFor="roomCode"
                  className="block font-['Inter'] text-[#9CA3AF] text-sm tracking-wide uppercase"
                >
                  Room Code
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={roomCode[index] || ""}
                      onChange={(e) => {
                        const newCode = roomCode.split("");
                        newCode[index] = e.target.value.toUpperCase();
                        setRoomCode(newCode.join(""));
                        
                        // Auto-focus next input
                        if (e.target.value && index < 5) {
                          const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                      className="w-full aspect-square px-0 text-center text-2xl font-['Orbitron'] 
                        bg-[#1A1F28] border-2 border-[#6B7280] rounded-lg
                        text-[#00D9FF] placeholder-[#6B7280]
                        focus:border-[#00D9FF] focus:outline-none focus:shadow-[0_0_20px_rgba(0,217,255,0.3)]
                        transition-all duration-300 uppercase"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Room code display for create mode */}
            {isCreateMode && (
              <div className="space-y-3">
                <label className="block font-['Inter'] text-[#9CA3AF] text-sm tracking-wide uppercase">
                  Your Room Code
                </label>
                <div className="flex gap-2 justify-center">
                  {["A", "B", "C", "D", "E", "F"].map((letter, index) => (
                    <div
                      key={index}
                      className="w-full aspect-square flex items-center justify-center
                        bg-[#1A1F28] border-2 border-[#00D9FF] rounded-lg
                        text-[#00D9FF] text-2xl font-['Orbitron']
                        shadow-[0_0_15px_rgba(0,217,255,0.3)]"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <p className="text-center text-[#9CA3AF] text-sm font-['Inter'] mt-2">
                  Share this code with other players
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <GlowButton
                type="submit"
                variant="resistance"
                className="w-full"
                disabled={!username.trim() || (!isCreateMode && roomCode.length !== 6)}
              >
                {isCreateMode ? "Create & Enter" : "Join Game"}
              </GlowButton>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
