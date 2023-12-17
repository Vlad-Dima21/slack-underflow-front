'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import QuestionState from '@enums/QuestionState';
import { useCurrentUser } from '@helpers/user-hook';
import { useRouter } from 'next/navigation';
import fetch from '@helpers/fetch';
import Topic from './Topic';
import { Button, ButtonType } from './Button';

const Question = ({ title, state, baseRoute, setIsInEdit: updateIsInEdit }) => {
    const router = useRouter();
    const [currentUser] = useCurrentUser();
    const editEnabled = useMemo(() => state == QuestionState.New, [state])
    const [isInEdit, setIsInEdit] = useState(state == QuestionState.New);
    const [topics, setTopics] = useState([]);
    const [question, setQuestion] = useState({
        topics: [],
        body: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionResult, setActionResult] = useState('');

    const toggleIsInEdit = useCallback(() => {
        setIsInEdit(i => !i);
        updateIsInEdit(!isInEdit);
    }, [isInEdit, updateIsInEdit]);

    const toggleTopic = useCallback((topic) => {
        const tIndex = question.topics.indexOf(topic);
        if (tIndex == -1) {
            setQuestion(q => ({ ...q, topics: [...q.topics, topic] }));
        } else {
            setQuestion(q => ({ ...q, topics: q.topics.toSpliced(tIndex, 1) }));
        }
    }, [topics, question]);

    const createQuestion = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch({
                url: `${baseRoute}/question/create`, 
                method: 'POST',
                bearer: currentUser.userToken,
                body: JSON.stringify({
                    body: question.body,
                    topics: question.topics,
                })
            });
            if (!response.ok) {
                setActionResult('Could not add question');
                return;
            }
            const data = await response.json();
            if (data.id) {
                router.push(`/question/${data.id}`);
            }
        } catch (error) {
            console.log(error);
            setActionResult('There was an error. Please try again');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setActionResult('');
            }, 3000);
        }
    }, [question, topics, currentUser]);

    useEffect(() => {
        const getTopics = async () => {
            try {
                const response = await fetch({
                    url: `${baseRoute}/topic/getAll`,
                    method: 'GET',
                    bearer: currentUser.userToken
                });
                if (response.ok) {
                    const data = await response.json();
                    setTopics(data.map(topic => topic.topic) || []);
                }
            } catch (error) {
                console.log(error);
                setActionResult('There was an error getting the topics');
            }
        }
        if (currentUser) {
            getTopics();
        }
    }, [currentUser]);
  return (
    <div className='question-container'>
        <h1 className='head_text text-left'>
        <span className='blue_gradient'>{title}</span>
        </h1>
          <div className='flex flex-col'>
            <span className='font-satoshi font-semibold text-base text-gray-700'>Topics</span>
          <div className='mt-2 flex align-middle gap-2 sm:gap-4'>
            {topics.map(topic => (
                <Topic
                    key={topic}
                    enabled={isInEdit}
                    toggleTopic={toggleTopic}
                    topic={topic}
                    selected={question.topics.includes(topic)}
                />
            ))}
        </div>
        </div>
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Description
          </span>
          <textarea
            disabled={!isInEdit}
            value={question.body}
            onChange={e => setQuestion(q => ({ ...q, body: e.target.value }))}
            placeholder='Write the question'
            className='form_textarea'
          />
          </label>
          <div className='flex justify-between'>
              <span className='px-2 py-1 text-red-500'>{actionResult}</span>
              {isInEdit && <div className='flex align-middle sm:gap-4 gap-2'>
                  <Button
                      text='Cancel'
                      enabled={true}
                      type={ButtonType.Text}
                      link='/'
                  />
                  <Button
                      text='Submit'
                      enabled={!isSubmitting}
                      type={ButtonType.Fill}
                      onClick={createQuestion}
                      className='!text-white !bg-indigo-700 hover:!bg-indigo-600'
                  />
              </div>}
          </div>
    </div>
  )
}

export default Question;