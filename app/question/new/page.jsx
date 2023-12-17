import Question from '@components/Question';
import QuestionState from '@enums/QuestionState';
import React from 'react';

const NewQuestion = () => {
  return (
    <Question
        title='New question'
        state={QuestionState.New}
        baseRoute={process.env.BACKEND_URL}
    />
  )
}

export default NewQuestion;