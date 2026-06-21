import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { ArrowLeft, Clock, CheckCircle, XCircle, Award, ChevronRight } from 'lucide-react';
import userStore from '../services/UserStore';

export default function QuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { addPoints } = usePoints();
  const quiz = quizzes.find(q => q.id === quizId);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState((quiz?.duration || 20) * 60);
  const [answers, setAnswers] = useState([]);

  const questions = quiz?.questionList || [];

  useEffect(() => {
    if (finished || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setFinished(true); clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, quiz]);

  if (!quiz) return <div className="empty-state"><h3>Quiz not found</h3><button className="btn btn-primary" onClick={() => navigate('/skills')}>Back to Skills</button></div>;

  const question = questions[currentQ];
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const passed = percentage >= quiz.passScore;

  const handleAnswer = () => {
    if (selected === null) return;
    const correct = selected === question.correct;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { questionIndex: currentQ, selected, correct }]);
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);

      // Award points
      addPoints(10, 'Complete a skill quiz');
      if (percentage >= 80) addPoints(5, 'Score 80%+ bonus');

      // Persist quiz completion to UserStore
      if (user && passed) {
        const completedQuizzes = [...new Set([...(user.completedQuizzes || []), quiz.id])];
        const quizzesPassed = completedQuizzes.length;

        // Check if we should award a badge
        const newBadges = [...(user.badges || [])];
        if (quiz.badgeId && !newBadges.includes(quiz.badgeId)) {
          newBadges.push(quiz.badgeId);
        }
        // First Steps badge if not earned yet
        if (!newBadges.includes('b15')) {
          newBadges.push('b15');
        }

        userStore.updateUserProgress(user.id, {
          completedQuizzes,
          quizzesPassed,
          badges: newBadges,
        });
        refreshUser();
      }
    }
  };

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  if (finished) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div className="card card-elevated" style={{ padding: 'var(--space-10)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
            {passed ? '🎉' : '📚'}
          </div>
          <h2 style={{ marginBottom: 'var(--space-2)' }}>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
          <p style={{ color: 'var(--we-gray-500)', marginBottom: 'var(--space-6)' }}>
            {passed ? `You passed the ${quiz.title} quiz!` : `You didn't pass this time, but you can retake it.`}
          </p>

          <div style={{ fontSize: 'var(--text-4xl)', fontFamily: 'var(--font-mono)', fontWeight: 800, color: passed ? 'var(--we-success)' : 'var(--we-rot)', marginBottom: 'var(--space-2)' }}>
            {percentage}%
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--we-gray-500)', marginBottom: 'var(--space-6)' }}>
            {score}/{totalQuestions} correct · Pass score: {quiz.passScore}%
          </p>

          <div className="progress-bar" style={{ height: 12, marginBottom: 'var(--space-6)', maxWidth: 300, margin: '0 auto var(--space-6)' }}>
            <div
              className={`progress-bar-fill ${passed ? 'green' : ''}`}
              style={{ width: `${percentage}%`, background: passed ? 'var(--we-success)' : 'var(--we-rot)', transition: 'width 1.5s ease-out' }}
            />
          </div>

          {passed && (
            <div style={{ padding: 'var(--space-4)', background: 'var(--we-success-bg)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-5)' }}>
              <Award size={24} style={{ color: 'var(--we-success)', marginBottom: 'var(--space-2)' }} />
              <p style={{ fontWeight: 600, color: '#047857' }}>+10 points earned! {percentage >= 80 ? '+5 bonus for 80%+!' : ''}</p>
              {quiz.badgeId && <p style={{ fontSize: 'var(--text-sm)', color: '#047857' }}>🏅 Badge unlocked: Check your profile!</p>}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/skills')}>Back to Skills</button>
            {!passed && <button className="btn btn-primary" onClick={() => { setCurrentQ(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); setAnswers([]); setTimeLeft(quiz.duration * 60); }}>Retake Quiz</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Quiz Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/skills')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--we-gray-600)' }}>
            {currentQ + 1} / {totalQuestions}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontWeight: 600, color: timeLeft < 120 ? 'var(--we-error)' : 'var(--we-gray-600)' }}>
            <Clock size={16} /> {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 'var(--space-6)', height: 6 }}>
        <div
          className="progress-bar-fill cyan"
          style={{ width: `${((currentQ) / totalQuestions) * 100}%`, transition: 'width 0.3s' }}
        />
      </div>

      {/* Question */}
      {question && (
        <div className="quiz-card">
          <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>{question.q}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {question.options.map((opt, i) => {
              let className = 'quiz-option';
              if (answered) {
                if (i === question.correct) className += ' correct';
                else if (i === selected && i !== question.correct) className += ' incorrect';
              } else if (i === selected) {
                className += ' selected';
              }
              return (
                <div key={i} className={className} onClick={() => !answered && setSelected(i)}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--we-gray-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: i === selected ? 'var(--we-cyan)' : 'transparent' }}>
                    {answered && i === question.correct && <CheckCircle size={16} style={{ color: 'var(--we-success)' }} />}
                    {answered && i === selected && i !== question.correct && <XCircle size={16} style={{ color: 'var(--we-error)' }} />}
                    {!answered && i === selected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{opt}</span>
                </div>
              );
            })}
          </div>

          {answered && question.explanation && (
            <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--we-cyan-light)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
              <strong>Explanation:</strong> {question.explanation}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)', gap: 'var(--space-3)' }}>
            {!answered ? (
              <button className="btn btn-primary" onClick={handleAnswer} disabled={selected === null}>
                Submit Answer
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                {currentQ < totalQuestions - 1 ? <>Next <ChevronRight size={16} /></> : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
