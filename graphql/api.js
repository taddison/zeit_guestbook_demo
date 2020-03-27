import useFetch from '../lib/useFetch'
// import fetch from 'fetch'

const getHeaders = () => {
  return {
    Authorization: `Bearer ${process.env.faunaDbSecret}`,
    'Content-type': 'application/json',
    Accept: 'application/json',
  }
}

function getData(data) {
  if (!data || data.errors) return null
  return data.data
}

function getErrorMessage(error, data) {
  if (error) return error.message
  if (data && data.errors) {
    return data.errors[0].message
  }
  return null
}

/**
|--------------------------------------------------
| This GraphQL query returns an array of Guestbook
| entries complete with both the provided and implicit
| data attributes.
|
| Learn more about GraphQL: https://graphql.org/learn/
|--------------------------------------------------
*/
export const useGuestbookEntries = () => {
  const query = `query Entries($size: Int) {
    entries(_size: $size) {
      data {
        _id
        _ts
        twitter_handle
        story
      }
      after
    }
  }`
  const size = 100
  const { data, error } = useFetch(process.env.faunaDbGraphQlEndpoint, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      variables: { size },
    }),
  })

  return {
    data: getData(data),
    errorMessage: getErrorMessage(error, data),
    error,
  }
}

/**
|--------------------------------------------------
| This GraphQL mutation creates a new GuestbookEntry
| with the requisite twitter handle and story arguments.
|
| It returns the stored data and includes the unique
| identifier (_id) as well as _ts (time created).
|
| The guestbook uses the _id value as the unique key
| and the _ts value to sort and display the date of
| publication.
|
| Learn more about GraphQL mutations: https://graphql.org/learn/queries/#mutations
|--------------------------------------------------
*/
export const createGuestbookEntry = async (twitterHandle, story) => {
  const query = `mutation CreateGuestbookEntry($twitterHandle: String!, $story: String!) {
    createGuestbookEntry(data: {
      twitter_handle: $twitterHandle,
      story: $story
    }) {
      _id
      _ts
      twitter_handle
      story
    }
  }`

  const res = await fetch(process.env.faunaDbGraphQlEndpoint, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      variables: { twitterHandle, story },
    }),
  })
  const data = await res.json()

  return data
}

export const createSession = async (sessionId) => {
  const query = `mutation CreateSession($sessionId:Int!) {
    createSession(data: {
      sessionId: $sessionId
    }) {
      _id
      _ts
      sessionId
    }
  }`;

  const res = await fetch(process.env.faunaDbGraphQlEndpoint, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      variables: { sessionId },
    }),
  });

  const data = await res.json();

  return data;
}