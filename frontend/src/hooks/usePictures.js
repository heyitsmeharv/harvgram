import { useQuery } from '@tanstack/react-query';
import { getImages } from "../api/api";

export const usePictures = tag => {
  return useQuery({
    queryKey: ['pictures', tag],
    queryFn: async () => {
      const response = await getImages(tag);
      return response.body.pictures;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: true,
  });
}