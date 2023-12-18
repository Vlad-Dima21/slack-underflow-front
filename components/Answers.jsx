'use client';

import React, { useCallback, useState, useMemo } from 'react';
import { Button, ButtonType } from './Button';
import { useCurrentUser } from '@helpers/user-hook';
import fetchHelper from '@helpers/fetch';

const Answers = ({ questionId, questionAuthor, baseRoute }) => {
    const [currentUser] = useCurrentUser();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState('');
    const allowComment = useMemo(() => currentUser && questionAuthor?.username != currentUser.userName
        , [questionAuthor, currentUser]);
    const postComment = useCallback(async (e) => {
        e.preventDefault()
        setIsSubmitting(true);
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/answer/create`,
                method: 'POST',
                bearer: currentUser.userToken,
                body: {
                    body: comment,
                    questionId: questionId
                }
            });
            if (!response.ok) {
                setSubmitResult('Could not add comment');
                return;
            }
            const data = await response.json();
            setComments(comments => [...comments, { id: data.id, body: data.body, rank: data.rank }]);
        } catch (error) {
            console.log(error);
            setSubmitResult('There was an error. Please try again');
        } finally {
            setComment('');
            setTimeout(() => {
                setSubmitResult('');
            }, 3000);
        }
    }, [comment, questionId]);
  return (
      <section className='question-container'>
          <label className='form-label'>
              Answers
          </label>
          <form className='min-h-[42px] mb-8 w-full flex justify-between gap-2 break-inside-avoid rounded-full bg-white/70'
            onSubmit={postComment}>
              <input
                  value={comment}
                  onChange={(e => setComment(e.target.value))}
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
    </section>
  )
}

export default Answers;