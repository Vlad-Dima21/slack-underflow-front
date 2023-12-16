'use client';

import AccountForm from '@components/AccountForm';
import React, {useState} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUserToken, saveCurrentUser } from '@helpers/user-details';

const Authentication = ({route, method, actionName}) => {
    const router = useRouter();
    const params = useSearchParams();
    const [credentials, setCredentials] = useState({
        userName: '',
        password: '',
    });
    const [actionInProgress, setActionInProgress] = useState(false);
    const [actionResult, setActionResult] = useState(null);
    const handleAction = async (e) => {
        e.preventDefault();
        setActionInProgress(true);

        try {
            const response = await fetch(route, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.userName,
                    password: credentials.password
                }),
            })
            if (response.ok) {
                const data = await response.json();
                saveCurrentUser(data, localStorage);
                router.push(params.get('prev'));
            } else {
                response.status == 401 && setActionResult('Invalid credentials');
            }
        } catch (error) {
            console.log(error);
            setActionResult('There was an error. Please try again');
        } finally {
            setActionInProgress(false);
            setTimeout(() => {
                setActionResult(null);
            }, 5000);
        }
    }

    return (
      <AccountForm
          action={actionName}
          credentials={credentials}
          actionInProgress={actionInProgress}
          handleAction={handleAction}
          actionResult={actionResult}  
          setCredentials={setCredentials}
    />
  )
}

export default Authentication;