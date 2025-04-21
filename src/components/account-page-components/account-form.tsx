'use client';

import Form from 'next/form'
import InputField from './input-field';

const AccountForm = () => {
    const handleSubmit = async () => {
        console.log("Hello world")
    }

  return (
    <Form action={handleSubmit} className='grid sm:grid-cols-1 md:grid-cols-2 gap-4'>
        <InputField label='First Name' inputValue='Hello world' />
        <InputField label='First Name' inputValue='Hello world' />
    </Form>
  )
}

export default AccountForm