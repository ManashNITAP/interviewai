import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Volume2, VolumeX, Mic, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext.jsx';
import { interviewApi } from '../../api/interview.api.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Spinner from '../../components/common/Spinner.jsx';

const SpeechRecognition =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const Bubble = ({ msg }) => {
  const fromUser = msg.sender === 'user';
  return (
    <div className={`flex ${fromUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${fromUser ? 'bg-brand-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
        <p className="whitespace-pre-wrap">{msg.content}</p>
        <p className={`mt-1 text-[10px] ${fromUser ? 'text-brand-100' : 'text-zinc-500'}`}>
          {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default function InterviewSession() {
  const { id } = useParams();
  const { socket, connected } = useSocket();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [progress, setProgress] = useState({ index: 0, total: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listening, setListening] = useState(false);

  const scrollRef = useRef(null);
  const voiceOnRef = useRef(true);
  const lastQuestionRef = useRef('');
  const spokenRef = useRef(new Set());
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const finalTextRef = useRef('');

  useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);

  // ---- Text-to-speech: speak the AI's question aloud ----
  const speak = (text, force = false) => {
    if (!ttsSupported || !text) return;
    if (!voiceOnRef.current && !force) return;
    const synth = window.speechSynthesis;
    synth.cancel();                 // interrupt anything already speaking
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 1;                     // 0.5 = slower, 1.5 = faster
    u.pitch = 1;
    synth.speak(u);
  };

  const speakQuestion = (text) => {
    lastQuestionRef.current = text;
    if (spokenRef.current.has(text)) return;   // don't auto-repeat the same question
    spokenRef.current.add(text);
    speak(text);
  };

  // ---- Speech-to-text: dictate the answer with the mic ----
  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleMic = () => {
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported here. Try Chrome or Edge.');
      return;
    }
    if (listening) { stopListening(); return; }

    window.speechSynthesis?.cancel();        // don't dictate over the question audio
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    baseTextRef.current = draft ? draft.trim() + ' ' : '';
    finalTextRef.current = '';

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTextRef.current += t + ' ';
        else interim += t;
      }
      setDraft(baseTextRef.current + finalTextRef.current + interim);
    };
    recognition.onerror = (e) => {
      if (e.error !== 'aborted' && e.error !== 'no-speech') toast.error(`Mic: ${e.error}`);
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const toggleVoice = () => {
    setVoiceOn((v) => {
      if (v) window.speechSynthesis?.cancel();  // turning off -> stop current speech
      return !v;
    });
  };

  // Stop audio + mic when leaving the page
  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, aiTyping]);

  useEffect(() => {
    if (!socket || !connected) return;

    const onState = ({ currentIndex, total, currentQuestion }) => {
      setProgress({ index: currentIndex, total });
      if (currentQuestion) {
        setMessages((m) => (m.some((x) => x.content === currentQuestion)
          ? m
          : [...m, { sender: 'ai', content: currentQuestion, timestamp: Date.now() }]));
        speakQuestion(currentQuestion);
      }
    };
    const onHistory = ({ messages: msgs }) => {
      if (msgs && msgs.length) setMessages(msgs);
    };
    const onQuestion = ({ question, index }) => {
      setProgress((p) => ({ ...p, index }));
      setMessages((m) => (m.some((x) => x.content === question)
        ? m
        : [...m, { sender: 'ai', content: question, timestamp: Date.now() }]));
      speakQuestion(question);
    };
    const onFeedback = ({ evaluation }) => {
      setSubmitting(false);
      setMessages((m) => [...m, { sender: 'ai', content: `Feedback: ${evaluation.feedback}`, timestamp: Date.now() }]);
    };
    const onTyping = ({ who, typing }) => { if (who === 'ai') setAiTyping(typing); };
    const onDone = () => setMessages((m) => [...m, { sender: 'system', content: 'All questions answered. Finishing up...', timestamp: Date.now() }]);
    const onError = ({ message }) => { toast.error(message); setSubmitting(false); };

    socket.on('interview:state', onState);
    socket.on('chat:history', onHistory);
    socket.on('interview:question', onQuestion);
    socket.on('interview:feedback', onFeedback);
    socket.on('interview:typing', onTyping);
    socket.on('interview:done', onDone);
    socket.on('interview:error', onError);

    socket.emit('interview:join', { interviewId: id });
    socket.emit('chat:history', { interviewId: id });

    return () => {
      socket.off('interview:state', onState);
      socket.off('chat:history', onHistory);
      socket.off('interview:question', onQuestion);
      socket.off('interview:feedback', onFeedback);
      socket.off('interview:typing', onTyping);
      socket.off('interview:done', onDone);
      socket.off('interview:error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, connected, id]);

  const send = () => {
    if (!draft.trim() || submitting) return;
    stopListening();
    window.speechSynthesis?.cancel();
    const answer = draft.trim();
    setMessages((m) => [...m, { sender: 'user', content: answer, timestamp: Date.now() }]);
    setDraft('');
    setSubmitting(true);
    socket.emit('interview:answer', { interviewId: id, answer });
  };

  const finish = async () => {
    stopListening();
    window.speechSynthesis?.cancel();
    setCompleting(true);
    try {
      await interviewApi.complete(id);
      navigate(`/interview/${id}/result`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not finalize');
    } finally { setCompleting(false); }
  };

  const allAnswered = progress.total > 0 && progress.index >= progress.total;

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Interview in progress</h1>
          <p className="text-xs text-zinc-500">
            {connected ? 'Live' : 'Reconnecting...'}
            {progress.total > 0 && ` · Question ${Math.min(progress.index + 1, progress.total)} / ${progress.total}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {ttsSupported && (
            <>
              <button
                onClick={toggleVoice}
                title={voiceOn ? 'Mute question audio' : 'Unmute question audio'}
                className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                {voiceOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-zinc-400" />}
              </button>
              <button
                onClick={() => speak(lastQuestionRef.current, true)}
                title="Replay current question"
                disabled={!lastQuestionRef.current}
                className="rounded-md p-2 hover:bg-zinc-100 disabled:opacity-40 dark:hover:bg-zinc-900"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          )}
          <Button variant="secondary" onClick={finish} loading={completing} disabled={!allAnswered}>
            Finish &amp; evaluate
          </Button>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-6">
          {messages.length === 0 && <div className="flex h-full items-center justify-center"><Spinner /></div>}
          {messages.map((m, i) => <Bubble key={i} msg={m} />)}
          {aiTyping && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '120ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '240ms' }} />
              </span>
              AI is evaluating...
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <div className="flex items-end gap-2">
            {SpeechRecognition && (
              <button
                onClick={toggleMic}
                disabled={submitting || allAnswered}
                title={listening ? 'Stop dictation' : 'Answer with your voice'}
                className={`shrink-0 rounded-lg p-2.5 transition disabled:opacity-50 ${
                  listening
                    ? 'animate-pulse bg-red-500 text-white'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                }`}
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={allAnswered ? 'All done - click Finish' : listening ? 'Listening... speak your answer' : 'Type or speak your answer... (Shift+Enter for new line)'}
              disabled={submitting || allAnswered}
              rows={2}
              className="flex-1 resize-none rounded-lg border border-zinc-300 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <Button onClick={send} loading={submitting} disabled={!draft.trim() || allAnswered}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {listening && (
            <p className="mt-1.5 text-[11px] text-red-500">● Recording — click the mic again to stop, then send.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
