import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  X, 
  Sparkles, 
  Award, 
  Gamepad2
} from 'lucide-react';

// JSON CONFIG FAYLIDAN MA'LUMOTLARNI CHAQIRISH
import teacherData from './teacher-config.json';

interface LessonVideo {
  id: string;
  title: string;
  duration: string;
  topic: string;
  level: string;
  subtitles: { time: number; textUz: string; textEn: string }[];
  vocab: { word: string; meaning: string }[];
}

export default function App() {
  // Modal states
  const [activeModal, setActiveModal] = useState<'video' | null>(null);
  
  // Interactive Video Player State
  const [selectedVideo, setSelectedVideo] = useState<LessonVideo | null>(
    teacherData.lessons && teacherData.lessons.length > 0 ? (teacherData.lessons[0] as any) : null
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [videoDuration] = useState<number>(105); 
  const [subtitleText, setSubtitleText] = useState({ uz: "", en: "" });
  const playIntervalRef = useRef<any>(null);

  // Quiz State
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Ismning bosh harflarini olish funksiyasi (Rasm bo'lmagan holat uchun)
  const getInitials = (name: string) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Video player simulyatsiyasi uchun useEffect
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= videoDuration) {
            setIsPlaying(false);
            clearInterval(playIntervalRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, videoDuration]);

  // Subtitrlarni vaqtga qarab yangilash
  useEffect(() => {
    if (!selectedVideo) return;
    const matchingSubtitle = selectedVideo.subtitles.find(
      (sub, idx) => {
        const nextSub = selectedVideo.subtitles[idx + 1];
        return currentTime >= sub.time && (!nextSub || currentTime < nextSub.time);
      }
    );
    if (matchingSubtitle) {
      setSubtitleText({ uz: matchingSubtitle.textUz, en: matchingSubtitle.textEn });
    } else {
      setSubtitleText({ uz: "", en: "" });
    }
  }, [currentTime, selectedVideo]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setQuizScore(null);
  };

  const selectQuizAnswer = (optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuizIndex]: optionIdx }));
  };

  const nextQuizQuestion = () => {
    if (teacherData.quiz && currentQuizIndex < teacherData.quiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else if (teacherData.quiz) {
      let score = 0;
      teacherData.quiz.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) score++;
      });
      setQuizScore(score);
    }
  };

  return (
    <div id="portfolio-root" className="min-h-screen bg-[#0B0A0F] text-neutral-100 font-sans selection:bg-[#FF6B00]/30 selection:text-white relative overflow-x-hidden antialiased">
      
      {/* Orqa fon effektlari */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[55vh] rounded-full bg-gradient-to-b from-[#8B2D0C]/25 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#FF5C00]/5 blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[550px] h-[550px] rounded-full bg-[#8A3DFF]/5 blur-[180px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 flex flex-col items-center">
        
        {/* Logotip qismi */}
        <header id="header-section" className="mb-10 md:mb-14 flex flex-col items-center select-none">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-center">
              <span className="text-xl font-black tracking-widest text-white leading-none">REGISTON</span>
              <span className="text-[10px] tracking-[4px] font-bold text-neutral-400 mt-1 uppercase leading-none">O'QUV MARKAZI</span>
            </div>
          </div>
        </header>

        {/* Sarlavha */}
        <section id="hero-headings" className="text-center mb-12 sm:mb-16 max-w-4xl px-2">
          <h1 className="text-3xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF9E4A] via-[#FF6B00] to-[#E05300] drop-shadow-sm leading-tight">
            Ustozingiz bilan tanishib oling
          </h1>
          <p className="mt-4 text-xs sm:text-sm md:text-base text-neutral-400 tracking-wide font-medium max-w-2xl mx-auto leading-relaxed">
            Markazimizning eng tajribali ustozlaridan biri, <span className="text-white font-semibold">{teacherData.name}</span>, ular bilan qisqacha tanishib chiqishingiz mumkin:
          </p>
        </section>

        {/* Asosiy ma'lumotlar paneli */}
        <div id="main-portfolio-grid" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-stretch">
          
          {/* PREMIUM NEON EFFEKTLI AVATAR BLOKI */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="relative group w-full h-[400px] sm:h-[480px] lg:h-[580px] rounded-2xl overflow-hidden border border-neutral-800 bg-[#121118]/80 shadow-[0_0_40px_-15px_rgba(255,107,0,0.25)] flex items-center justify-center transition-all duration-500 hover:border-[#FF6B00]/40">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80 z-10" />
              
              {teacherData.teacherImg && teacherData.teacherImg.trim() !== "" ? (
                <img 
                  src={teacherData.teacherImg} 
                  alt={`${teacherData.name} Portrait`} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1A1625] via-[#0F0E15] to-[#251A12] flex flex-col items-center justify-center gap-5 select-none relative">
                  
                  {/* Orqa fondagi maxsus neon nuri */}
                  <div className="absolute w-56 h-56 rounded-full bg-[#FF6B00]/10 blur-[60px] pointer-events-none" />
                  <div className="absolute w-40 h-40 rounded-full bg-violet-600/10 blur-[50px] pointer-events-none" />
                  
                  {/* Katta va yorqin Monogramma doirasi */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#262235] to-[#15131D] border border-neutral-700/70 flex items-center justify-center text-4xl font-black text-[#FF7F1A] tracking-wider shadow-[0_15px_50px_rgba(255,107,0,0.2)] relative z-10 group-hover:border-[#FF6B00]/60 transition-all duration-300 transform group-hover:scale-105">
                    {getInitials(teacherData.name)}
                    <div className="absolute -inset-[1px] rounded-full bg-gradient-to-tr from-[#FF6B00]/20 via-transparent to-violet-500/20 pointer-events-none" />
                  </div>
                  
                  {/* Matnli dizayn elementi */}
                  <div className="flex flex-col items-center gap-1.5 z-10 text-center px-4">
                    <span className="text-[10px] text-[#FF9E4A] font-extrabold tracking-[4px] uppercase bg-[#FF6B00]/10 px-3.5 py-1 rounded-full border border-[#FF6B00]/20">
                      OFFICIAL PROFILE
                    </span>
                    <span className="text-[10px] text-neutral-500 font-semibold tracking-[1.5px] uppercase mt-1">
                      Registon Master Instructor
                    </span>
                  </div>

                </div>
              )}
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="px-3 py-1 text-[11px] font-extrabold uppercase bg-red-600/90 text-white rounded-md tracking-wider shadow-md">
                    IELTS 8.0
                  </span>
                  <span className="px-3 py-1 text-[11px] font-extrabold uppercase bg-amber-500 text-neutral-950 rounded-md tracking-wider shadow-md">
                    Top Teacher
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white mt-2 drop-shadow">
                  {teacherData.name}
                </h3>
                <p className="text-xs text-neutral-300 flex items-center gap-1.5 drop-shadow">
                  <span>🎓 {teacherData.role}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                  <span>{teacherData.branchName}</span>
                </p>
              </div>

              <div className="absolute top-4 left-4 border-l-2 border-t-2 border-[#FF6B00]/60 w-6 h-6 rounded-tl-md pointer-events-none" />
              <div className="absolute bottom-4 right-4 border-r-2 border-b-2 border-[#FF6B00]/60 w-6 h-6 rounded-br-md pointer-events-none" />
            </div>
          </div>

          {/* O'rta ustun: Portfolio kartalari */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {teacherData.portfolioCards.map((card, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-xl bg-[#14121B]/95 border border-neutral-800/90 hover:border-neutral-700/80 transition-all duration-300 flex flex-col gap-2 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.01] to-transparent pointer-events-none" />
                <h4 className="text-xs sm:text-[13px] font-bold tracking-widest uppercase text-neutral-400 flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded bg-[#FF6B00]"></span>
                  {card.title}
                </h4>
                <p className="text-sm md:text-base text-neutral-200 leading-relaxed font-normal pl-3 relative">
                  <span className="absolute left-0 top-3 w-2 h-0.5 bg-indigo-500 rounded-full" />
                  {card.bullet}
                </p>
              </div>
            ))}
          </div>

          {/* O'ng ustun: Filosofiya va Hisoblagich panellari */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#181522] to-[#121019] border border-neutral-800/80 flex flex-col gap-4 relative">
              <h4 className="text-xs sm:text-[13px] font-bold tracking-widest uppercase text-neutral-400">
                Ustozlik filosofiyasi:
              </h4>
              <p className="text-sm text-neutral-200 leading-relaxed italic font-light">
                “{teacherData.philosophy}”
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#121118] to-[#161424] border border-neutral-800/80 hover:border-[#FF6B00]/30 transition-colors flex flex-col items-center justify-center text-center shadow-md relative group select-none">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                  {teacherData.experienceYears}
                </span>
                <span className="text-xs md:text-[13px] font-bold tracking-wide text-neutral-400 mt-2">
                  yillik dars o'tish tajribasi
                </span>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-[#121118] to-[#161424] border border-neutral-800/80 hover:border-[#FF6B00]/30 transition-colors flex flex-col items-center justify-center text-center shadow-md relative group select-none">
                <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                  {teacherData.studentsTaught}
                </span>
                <span className="text-xs md:text-[13px] font-bold tracking-wide text-neutral-400 mt-2">
                  o'quvchilar bilan ishlashgan
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* HARAKAT TUGMALARI (SIZ SO'RAGAN ORIGINAL LINKLAR SHU YERDA) */}
        <div id="footer-actions" className="flex flex-col items-center gap-4 mt-16 md:mt-24 w-full max-w-lg px-4">
          <button 
            onClick={() => window.open("https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDAyMzI1MDM3ODkyOTY5?story_media_id=3590210690787496240_52531394407&igsh=aGcxNWxsNHdwZzF3", "_blank")}
            className="w-full py-4 px-6 rounded-full font-bold text-sm sm:text-base text-white tracking-wide bg-gradient-to-r from-[#FF6B00] to-[#E05300] hover:from-[#FF7F1A] hover:to-[#EB5F0C] active:scale-[0.98] transition-all duration-300 shadow-[0_4px_25px_rgba(255,107,0,0.3)] flex items-center justify-center gap-3 cursor-pointer group text-center"
          >
            <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Play className="w-5 h-5 ml-0.5 fill-white stroke-none" />
            </div>
            <span>Ustozingizning darsidan lavhalar</span>
          </button>

          <button 
            onClick={() => window.open("https://t.me/registan_fergana_qabul_bot", "_blank")}
            className="w-full py-4 px-6 rounded-full font-bold text-sm sm:text-base text-white tracking-wide bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-300 shadow-[0_4px_25px_rgba(124,58,237,0.3)] flex items-center justify-center gap-3 cursor-pointer group text-center"
          >
            <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span>Kursga ro'yxatdan o'tish</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-neutral-900 pt-10 w-full flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
          <p className="text-xs text-neutral-500 font-medium tracking-wide">
            © 2026 Registon O'quv Markazi. Barcha huquqlar himoyalangan.
          </p>
        </footer>

      </div>

      {/* MODAL: Video Lavhalar & Test */}
      {activeModal === 'video' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121019] border border-neutral-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative my-8">
            
            <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-[#161421]">
              <h3 className="text-lg font-extrabold text-white">Dars Lavhalari & Test laboratoriyasi</h3>
              <button onClick={() => { setIsPlaying(false); setActiveModal(null); }} className="p-2 text-neutral-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-4 border-r border-neutral-800 p-4 bg-[#14121B] flex flex-col gap-3">
                <span className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase">Dars lavhalari</span>
                {teacherData.lessons && teacherData.lessons.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => { setSelectedVideo(video as any); setIsPlaying(false); setCurrentTime(0); }}
                    className={`p-3.5 rounded-xl text-left transition-all flex flex-col gap-1 cursor-pointer w-full ${
                      selectedVideo?.id === video.id ? 'bg-[#FF6B00]/10 border border-[#FF6B00]/40 text-white' : 'text-neutral-400 hover:bg-neutral-800/50'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-indigo-400 uppercase">{video.level}</span>
                    <span className="text-xs font-extrabold line-clamp-1">{video.title}</span>
                  </button>
                ))}

                <button
                  onClick={() => { setSelectedVideo(null); startQuiz(); }}
                  className={`p-3.5 mt-4 rounded-xl text-left border flex items-center gap-3 cursor-pointer w-full ${
                    quizStarted && !selectedVideo ? 'bg-[#8A3DFF]/10 border-[#8A3DFF]/40 text-white' : 'border-transparent text-neutral-400'
                  }`}
                >
                  <Gamepad2 className="w-4 h-4 text-[#8A3DFF]" />
                  <span className="text-xs font-extrabold">IELTS diagnostik testi</span>
                </button>
              </div>

              <div className="lg:col-span-8 p-6 bg-[#0E0C13]">
                {selectedVideo ? (
                  <div className="flex flex-col gap-5">
                    <div className="relative aspect-video rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 opacity-20 bg-neutral-900" />
                      
                      <div className="absolute bottom-16 left-4 right-4 text-center z-20 py-2.5 px-4 bg-black/75 rounded-xl">
                        <p className="text-xs font-semibold text-[#FF9E4A]">{subtitleText.uz || "Play tugmasini bosing"}</p>
                        <p className="text-[10px] text-neutral-300 mt-1 italic">{subtitleText.en}</p>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent flex items-center justify-between z-30">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="bg-white text-black p-2 rounded-full cursor-pointer">
                          {isPlaying ? <Pause className="w-4 h-4 stroke-neutral-950" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                        </button>
                        <span className="text-xs text-white">{selectedVideo.topic}</span>
                        <span className="text-[10px] font-mono text-neutral-300">0:{currentTime < 10 ? `0${currentTime}` : currentTime}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                      <h4 className="text-xs font-bold uppercase text-[#FF9E4A] mb-3">Muhim terminlar:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedVideo.vocab.map((item, idx) => (
                          <div key={idx} className="p-2 bg-neutral-950 rounded-lg flex flex-col">
                            <span className="text-xs font-bold text-white">{item.word}</span>
                            <span className="text-[10px] text-neutral-400">{item.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : quizStarted && teacherData.quiz ? (
                  <div className="flex flex-col gap-4">
                    {quizScore === null ? (
                      <div className="flex flex-col gap-4">
                        <h4 className="text-base font-bold text-white">{teacherData.quiz[currentQuizIndex].question}</h4>
                        <div className="flex flex-col gap-2">
                          {teacherData.quiz[currentQuizIndex].options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => selectQuizAnswer(idx)}
                              className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                                selectedAnswers[currentQuizIndex] === idx ? 'bg-[#FF6B00]/10 border-[#FF6B00] text-white' : 'bg-[#15131C] border-neutral-800 text-neutral-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={nextQuizQuestion}
                          disabled={selectedAnswers[currentQuizIndex] === undefined}
                          className="py-2 px-4 rounded-lg bg-indigo-600 text-xs self-end text-white font-bold disabled:bg-neutral-800 disabled:text-neutral-500 cursor-pointer"
                        >
                          {currentQuizIndex === teacherData.quiz.length - 1 ? "Yakunlash" : "Keyingi"}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 flex flex-col items-center gap-4">
                        <Award className="w-12 h-12 text-indigo-400" />
                        <h3 className="text-xl font-bold">Natijangiz: {quizScore} / {teacherData.quiz.length}</h3>
                        <p className="text-xs text-neutral-400">Ustoz guruhlarida chuqurroq o'rganishingiz mumkin.</p>
                        <button onClick={startQuiz} className="py-2 px-4 bg-neutral-800 rounded-xl text-xs font-bold text-white">Qayta topshirish</button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}