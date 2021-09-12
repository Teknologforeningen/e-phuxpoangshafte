import axios from 'axios';

const baseUrl = '/api/hash';

interface GetHashReturn {
  data: {
    hash: string;
  };
}

export const getHash = async ({
  eventId,
}: {
  eventId: number;
}): Promise<string> => {
  const url = `${baseUrl}/generate/${eventId}`;
  const { data }: GetHashReturn = await axios.get(url);
  const hash = data.hash;
  return hash;
};

interface Validate {
  eventId: number;
  valid: boolean;
}
interface ValidateReturn {
  data: Validate;
}

export const validateHash = async ({
  hash,
}: {
  hash: string;
}): Promise<Validate> => {
  const url = `${baseUrl}/validate/${hash}`;
  const { data }: ValidateReturn = await axios.get(url);
  const { eventId, valid } = data;
  return { eventId, valid };
};
