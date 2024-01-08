import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faAward } from '@fortawesome/free-solid-svg-icons';
import { useCurrentUser } from '@helpers/user-hook';
import fetchHelper from '@helpers/fetch';
import React, { useEffect, useState } from 'react'
import DropdownList from './DropdownList';
import { Button, ButtonType } from './Button';

const Answer = ({ baseRoute, answer, onDeleted, onChanged }) => {
    const [currentUser] = useCurrentUser();
    const [suggestions, setSuggestions] = useState([]);
    const [currentSuggestion, setCurrentSuggestion] = useState({
        body: '',
        shown: false,
        isSubmitting: false
    });
    const isAuthor = currentUser?.userName == answer?.user?.username;
    const isAuthorOfQuestion = currentUser?.userName == answer?.question?.user?.username;

    const deleteAnswer = async () => {
        if (!confirm(`Confirm answer deletion`)) {
            return;
        }
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/answer/delete/${answer.id}`,
                method: 'DELETE',
                bearer: currentUser.userToken
            });
            if (response.ok) {
                onDeleted(answer.id);
            }
            alert(message);
        } catch (error) {
            console.log(error);
        }
    }

    const setRank = async (rank) => {
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/answer/modify/rank/${answer.id}?rank=${rank}`,
                method: 'PATCH',
                bearer: currentUser.userToken
            });
            const data = await response.json();
            if (response.ok) {
                onChanged(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const postSuggestion = async (e) => {
        e.preventDefault();
        setCurrentSuggestion(s => ({ ...s, isSubmitting: true }));
        try {
            const response = await fetchHelper({
                url: `${baseRoute}/suggestion/create`,
                method: 'POST',
                bearer: currentUser.userToken,
                body: JSON.stringify({
                    answerId: answer.id,
                    body: currentSuggestion.body
                })
            });
            if (response.ok) {
                const data = await response.json();
                setSuggestions(s => [...s, data]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setCurrentSuggestion(s => ({ body: '', shown: false, isSubmitting: false }));
        }
    }

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await fetchHelper({
                    url: `${baseRoute}/suggestion/get/question/${answer.id}`,
                    method: 'GET',
                    bearer: currentUser.userToken
                });
                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (currentUser) {
            fetchSuggestions();   
        }
    }, [answer, currentUser]);

    return (
        <div className='flex flex-col gap-3 justify-center'>
            <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-2 bg-green-400/10 p-4 rounded-3xl'>
                    <div className='flex gap-1'>
                        <span className='text-gray-600 text-sm'>@{answer?.user?.username}</span>
                        <span className='!whitespace-normal !max-w-[34rem] question-card-title'>{answer.body}</span>
                    </div>
                    <span className='text-xs font-medium'>{new Date(answer.createTimestamp).toUTCString()}</span>
                </div>
                <div className='flex align-middle gap-3'>
                    {!isAuthorOfQuestion && <div
                            className={`m-2 text-sm ${answer.rank ? 'text-yellow-600' : 'text-gray-700'}`}
                        >
                            <FontAwesomeIcon icon={faAward} />
                            {answer.rank || ''}
                        </div>}
                    {!isAuthor && isAuthorOfQuestion && <DropdownList
                        className='flex justify-center items-center'
                        parent={
                            <div
                                className={`m-2 text-sm ${answer.rank ? 'text-yellow-600' : 'text-gray-700'}`}
                            >
                                <FontAwesomeIcon icon={faAward} />
                                {answer.rank || ''}
                            </div>
                        }
                        children={
                            <>
                                {[1, 2, 3].map(rank =>
                                    <div key={rank}
                                        className={`font-semibold p-3 ${answer.rank == rank ? 'text-yellow-600' : ''}`}
                                        onClick={() => setRank(rank)}>{rank}</div>)}
                            </>
                        }
                    />}
                    {isAuthor && <button
                        className='text-sm text-red-500 self-center m-2'
                        onClick={deleteAnswer}
                    >
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>}
                </div>
            </div>
        {/* suggestions */}
            <div className='flex flex-col gap-2'>
                <div className='flex items-center min-h-[25px]'>
                    <span
                        onClick={() => setCurrentSuggestion(s => ({...s, shown: !s.shown}))}
                        className='text-xs text-gray-600 cursor-pointer hover:underline pe-4'>
                        {currentSuggestion.shown ? 'Cancel suggestion' : 'Add suggestion'}
                    </span>
                    {currentSuggestion.shown && <form
                        onSubmit={postSuggestion}
                        className='flex flex-1 bg-white/70 rounded-full'>
                        <input
                            value={currentSuggestion.body}
                            onChange={e => setCurrentSuggestion(s => ({ ...s, body: e.target.value }))}
                            placeholder='Write suggestion...'
                            required
                            className='flex-1 form-input px-2 bg-transparent text-xs outline-none rounded-full'
                        />
                        <Button
                            className='!text-xs !py-1 !bg-yellow-800'
                            text={!currentSuggestion.isSubmitting ? 'Submit' : 'Submit...'}
                            enabled={!currentSuggestion.isSubmitting}
                            type={ButtonType.Fill}
                        />
                    </form>}
                </div>
                <div className='flex flex-col ps-6 gap-1'>
                    {suggestions.map((s, index) =>
                        <>
                            <div className='flex gap-1'>
                                <span className='text-gray-600 text-xs'>@{s.user.username}</span>
                                <span className='!whitespace-normal !text-xs !max-w-[34rem] question-card-title'>{s.body}</span>
                            </div>
                            {index != suggestions.length - 1 && <hr className='border-orange-400/30'/>}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Answer