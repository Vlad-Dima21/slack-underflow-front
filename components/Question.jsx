'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Answers from '@components/Answers';
import QuestionState from '@enums/QuestionState';
import { useCurrentUser } from '@helpers/user-hook';
import { useRouter, } from 'next/navigation';
import fetchHelper from '@helpers/fetch';
import Topic from './Topic';
import { Button, ButtonType } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';


const Question = ({ questionId, state, baseRoute, setIsInEdit: updateIsInEdit }) => {
    const router = useRouter();
    const [currentUser] = useCurrentUser();
    const [author, setAuthor] = useState(null);
    const isNewQuestion = useMemo(() => state == QuestionState.New, [state]);
    const isAuthor = useMemo(() => author && author?.username == currentUser?.userName, [currentUser, author]);
    const editEnabled = useMemo(() => isNewQuestion || isAuthor, [state, isAuthor]);
    const [isInEdit, setIsInEdit] = useState(isNewQuestion);
    
    const title = useMemo(() => {
        if (isNewQuestion) {
            return 'New question';
        }
        if (isAuthor) {
            return 'Your question';
        }
        if (author) {
            return `${author?.username}'s question`;
        }
        return  'Loading...'
    }, [currentUser, author, isAuthor]);

    const [topics, setTopics] = useState([]);
    const [question, setQuestion] = useState({
        topics: [],
        body: '',
        title: 'mihnea te iubesc',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionResult, setActionResult] = useState('');

    const toggleIsInEdit = useCallback(() => {
        setIsInEdit(i => !i);
        updateIsInEdit?.(!isInEdit);
    }, [isInEdit, updateIsInEdit]);

    const toggleTopic = useCallback((topic) => {
        const tIndex = question.topics.indexOf(topic);
        if (tIndex == -1) {
            setQuestion(q => ({ ...q, topics: [...q.topics, topic] }));
        } else if (question.topics.length > 1) {
            setQuestion(q => ({ ...q, topics: q.topics.toSpliced(tIndex, 1) }));
        }
    }, [topics, question]);

    const createQuestion = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/question/create`, 
                method: 'POST',
                bearer: currentUser.userToken,
                body: JSON.stringify({
                    title: question.title,
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

    const cancelQuestion = useCallback(async () => {
        const fields = ['Title', 'Body', 'Topics', 'Timestamp'],
            _question = fields.reduce((acc, field) => {
                acc[field.toLowerCase()] = question[`old${field}`];
                return acc;
            }, {});
        setQuestion(_question);
        setIsInEdit(i => !i);
        updateIsInEdit?.(!isInEdit);
    }, [question]);

    const updateQuestion = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/question/modify/${questionId}`,
                method: 'PUT',
                bearer: currentUser.userToken,
                body: JSON.stringify({
                    title: question.title,
                    body: question.body,
                    topics: question.topics
                })
            });
            if (!response.ok) {
                setActionResult('Could not update the question');
                return;
            }
            const data = await response.json();
            const fields = ['Title', 'Body', 'Topics', 'Timestamp'],
                _question = fields.reduce((acc, field) => {
                    acc[field.toLowerCase()] = acc[`old${field}`] = data[field.toLowerCase()];
                    return acc;
                }, {});
            setQuestion(_question);
            setIsInEdit(false);
        } catch (error) {
            setActionResult('Could not add question');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setActionResult('');
            }, 3000);
        }
    }, [question, topics, currentUser]);

    useEffect(() => {
        const getQuestion = async () => {
            try {
                const response = await fetchHelper({
                    url: `${baseRoute}/question/get/${questionId}`,
                    method: 'GET',
                    bearer: currentUser.userToken
                });
                if (response.ok) {
                    const questionData = await response.json();
                    const fields = ['Title', 'Body', 'Topics', 'Timestamp'],
                        _question = fields.reduce((acc, field) => {
                            acc[field.toLowerCase()] = acc[`old${field}`] = questionData[field.toLowerCase()];
                            return acc;
                        }, {});
                    _question.title = _question.oldTitle = 'Titlu setat hardcodat pentru ca mihnea face actualizari fara sa zica';
                    _question.topics = _question.oldTopics = ['UML']; //TODO scoate asta
                    setQuestion(_question);
                    setAuthor(questionData.user);
                } else {
                    router.push('/not-found');
                }
            } catch (error) {
                console.log(error);
                // router.push('/');
            }
        }
        if (currentUser && questionId) {
            getQuestion();
        }
    }, [currentUser, questionId]);

    useEffect(() => {
        const getTopics = async () => {
            try {
                const response = await fetchHelper({
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
      <section className='flex flex-col gap-10 align-middle w-full justify-center'>
          <div className='question-container'>
            <div className='flex justify-between align-middle'>
                <h1 className='head_text text-left'>
                    <span className='blue_gradient'>{title}</span>
                </h1>
                {!isInEdit && (<button
                    className='text-3xl h-min self-end pb-2 ml-2'
                    onClick={() => toggleIsInEdit(i => !i)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>)}  
            </div>
            <div className='flex flex-col'>
            <span className='form-label'>Topics</span>
            <div className='mt-2 flex align-middle gap-2 sm:gap-4'>
                {(isInEdit ? topics : question.topics).map(topic => (
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
            <span className='form-label'>
                Description
            </span>
            <textarea
                disabled={!isInEdit}
                value={question.body}
                onChange={e => setQuestion(q => ({ ...q, body: e.target.value }))}
                placeholder='Write the question'
                className='form_textarea !text-black'
            />
            </label>
            <div className='flex justify-between'>
                <span className='px-2 py-1 text-red-500'>{actionResult}</span>
                {isInEdit && <div className='flex align-middle sm:gap-4 gap-2'>
                    <Button
                        text='Cancel'
                        enabled={true}
                        type={ButtonType.Text}
                        onClick={!isNewQuestion ? cancelQuestion : undefined}
                        link={isNewQuestion ? '/' : undefined}
                    />
                    <Button
                        text='Submit'
                        enabled={!isSubmitting}
                        type={ButtonType.Fill}
                        onClick={isNewQuestion ? createQuestion : updateQuestion}
                        className='!text-white !bg-indigo-700 hover:!bg-indigo-600'
                    />
                </div>}
            </div>
        </div>
        {state != QuestionState.New && <Answers
            questionId={questionId}
              questionAuthor={author}
              baseRoute={baseRoute}
        />}
    </section>
  )
}

export default Question;