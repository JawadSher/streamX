"use client";

import Form from 'next/form'
import { Button } from '../ui/button';

function SubscribeBtn({ className }: { className?: string}) {
    const handleSubmit = () => {
        console.log("Hello world")
    }

  return (
    <Form action={handleSubmit} className='flex items-start w-full'>
        <Button className={className} type='submit'>Subscribe</Button>
    </Form>
  )
}

export default SubscribeBtn