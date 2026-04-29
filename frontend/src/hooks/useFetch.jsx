import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetch = (api, config = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsloading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!api) return;
        const fetchData = async () => {
            try {
                const response = await axios.get(api, config);
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
