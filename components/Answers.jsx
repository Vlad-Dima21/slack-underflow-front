'use client';

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Button, ButtonType } from './Button';
import { useCurrentUser } from '@helpers/user-hook';
import fetchHelper from '@helpers/fetch';
import Answer from './Answer';

const Answers = ({ questionId, questionAuthor, baseRoute }) => {
    const [currentUser] = useCurrentUser();
    const [userAnswer, setUserAnswer] = useState('');
    const [questionAnswers, setQuestionAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState('');
    const allowAnswer = useMemo(() => currentUser && questionAuthor?.username != currentUser.userName
        , [questionAuthor, currentUser]);
    const postAnswer = useCallback(async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/answer/create`,
                method: 'POST',
                bearer: currentUser.userToken,
                body: JSON.stringify({
                    body: userAnswer,
                    questionId: questionId
                })
            });
            if (!response.ok) {
                setSubmitResult('Could not add answer');
                return;
            }
            const data = await response.json();
            setQuestionAnswers(answers => [...answers, data]);
        } catch (error) {
            console.log(error);
            setSubmitResult('There was an error. Please try again');
        } finally {
            setIsSubmitting(false);
            setUserAnswer('');
            setTimeout(() => {
                setSubmitResult('');
            }, 3000);
        }
    }, [userAnswer, questionId]);

    useEffect(() => {
        const getAnswers = async () => {
            try {
                const response = await fetchHelper({
                    url: `${baseRoute}/answer/get/question/${questionId}`,
                    method: 'GET',
                    bearer: currentUser.userToken
                });
                if (response.ok) {
                    const data = await response.json();
                    setQuestionAnswers(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (currentUser) {
            getAnswers();
        }
    }, [currentUser]);

  return (
      <section className='question-container'>
          <label className='form-label'>
              Answers
          </label>
          <form className='min-h-[42px] mb-8 w-full flex justify-between gap-2 break-inside-avoid rounded-full bg-white/70'
            onSubmit={postAnswer}>
              <input
                  value={userAnswer}
                  onChange={(e => setUserAnswer(e.target.value))}
                  placeholder='Write an answer...'
                  required
                  className='form-input flex-1 bg-transparent px-4 py-1 outline-none'
              />
              <Button
                  text={!isSubmitting ? 'Submit' : 'Submit...'}
                  enabled={!isSubmitting}
                  type={ButtonType.Fill}
              />
          </form>
          <div className='flex flex-col gap-4'>
              {questionAnswers.map((answer, index) =>
                  <div key={answer.id} className='flex flex-col gap-2'>
                    <Answer
                        baseRoute={baseRoute}
                        answer={answer}
                        onDeleted={(id) => setQuestionAnswers(answers => answers.toSpliced(answers.findIndex(a => a.id == id), 1))}
                        onChanged={answers => setQuestionAnswers(answers)}  
                      />
                      {index != questionAnswers.length - 1 && <hr/>}
                  </div>)}
          </div>
    </section>
  )
}

export default Answers;