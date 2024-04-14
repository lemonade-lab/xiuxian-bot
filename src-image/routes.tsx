import React from 'react'
import MessageComponent from '../src/component/message.tsx'
import { personalInformation } from '../src/server/information.ts'
const uid = '13348342918169126729'
const data = await personalInformation(uid, '')
export const routes = [
  {
    url: '/message',
    element: <MessageComponent data={data} />
  }
]
