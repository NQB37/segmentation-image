import { useEffect, useState } from 'react';
import apiClient from '../api/client';

const useFetch = (api, config = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsloading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!api) return;
        const fetchData = async () => {
            try {
                const response = await apiClient.get(api, config);
                setData(response.data);
                setError(null);
            } catch (error) {
                setError(error);
            } finally {
                setIsloading(false);
            }
        };

        const timer = setTimeout(fetchData, 1000);

        return () => clearTimeout(timer);
    }, [api, JSON.stringify(config)]);

    return { data, isLoading, error };
};

export default useFetch;
