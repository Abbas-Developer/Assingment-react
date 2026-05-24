import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/Supabase';
// import _ from 'lodash';
// import _ from 'lodash-es';
import _ from 'lodash';

const Quiz = ({ session }) => {
  const { difficulty } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('loading');

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const loadQuestions = useCallback(async () => {
    setGameState('loading');
    setScore(0);
    setCurrentIndex(0);

    let amount = 5;
    let apiDifficulty = 'easy';

    if (difficulty === 'hard') {
      amount = 10;
      apiDifficulty = 'medium';
    } else if (difficulty === 'extreme') {
      amount = 20;
      apiDifficulty = 'hard';
    }

    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&difficulty=${apiDifficulty}&type=multiple`
      );
      const data = await response.json();

      if (data.response_code === 0) {
        const formatted = data.results.map((q) => {
          const decodedCorrect = decodeHTML(q.correct_answer);
          const decodedIncorrect = q.incorrect_answers.map(decodeHTML);
          const shuffledOptions = _.shuffle([decodedCorrect, ...decodedIncorrect]);

          return {
            question: decodeHTML(q.question),
            correctAnswer: decodedCorrect,
            options: shuffledOptions,
          };
        });

        setQuestions(formatted);
        setGameState('playing');
      } else {
        setGameState('error');
      }
    } catch {
      setGameState('error');
    }
  }, [difficulty]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setName(data.name);
      }
    };

    fetchProfile();
    loadQuestions();
  }, [session, loadQuestions]);

  const handleAnswerSelect = (option) => {
    const currentQuestion = questions[currentIndex];

    if (option === currentQuestion.correctAnswer) {
      const newScore = score + 10;
      setScore(newScore);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameState('won');
      }
    } else {
      setGameState('lost');
    }
  };

  if (gameState === 'loading') {
    return <div className="loading">Preparing Quiz...</div>;
  }

  if (gameState === 'error') {
    return (
      <div className="auth-container">
        <h2>Network Error</h2>
        <p>Failed to retrieve trivia questions. Please try again.</p>
        <button onClick={loadQuestions}>Retry</button>
        <button onClick={() => navigate('/dashboard')} className="secondary-btn">
          Dashboard
        </button>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="auth-container quiz-result win-state">
        <h2>Congratulations!</h2>
        <p className="personalized-msg">{name}, you have won!</p>
        <p className="final-score">Final Score: {score} Points</p>
        <button onClick={loadQuestions}>Play Again</button>
        <button onClick={() => navigate('/dashboard')} className="secondary-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="auth-container quiz-result lose-state">
        <h2>Game Over</h2>
        <p className="personalized-msg">{name}, you have lost!</p>
        <p className="final-score">Attempt Score: {score} Points</p>
        <button onClick={loadQuestions}>Retry Level</button>
        <button onClick={() => navigate('/dashboard')} className="secondary-btn">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="dashboard-container">
      <header className="quiz-header">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </header>

      <main className="quiz-content">
        <h3 className="question-text">{currentQuestion.question}</h3>
        <div className="options-grid">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(option)}
              className="option-btn"
            >
              {option}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Quiz;