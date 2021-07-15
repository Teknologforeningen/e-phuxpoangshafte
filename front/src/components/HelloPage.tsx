import React from 'react';

interface Props {
  email: string;
}

const HelloPage = (props: Props) => {
  const { email } = props;
  return (
    <div>
      <p>Hello {email}</p>
    </div>
  );
};

export default HelloPage;
