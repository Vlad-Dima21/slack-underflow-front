import fetch from "@helpers/fetch";

export const GET = async (request) => {
    try {
        const authorizationHeader = request.headers.get('Authorization');
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.slice(7);
            
            const backendResponse = await fetch({
                method: 'GET',
                bearer: token,
                url: `${process.env.BACKEND_URL}/topic/getAll`
            });
            let topics = await backendResponse.json();
            topics = topics.map(topic => topic.topic);
            return new Response(JSON.stringify(topics), { status: 200 });
        }
        return new Response('nok', { status: 401 });
    } catch (error) {
        console.log(error);
        return new Response('nok', { status: 500 });
    }
}