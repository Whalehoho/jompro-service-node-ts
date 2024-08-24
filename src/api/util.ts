import type { Response, ResponseBody } from '~/api';

export function success<ResBody extends ResponseBody>(
    response: Response<ResBody>,
    data?: ResBody,
    message: Json = 'ok',
    code = 200
): void {
    response.status(code).send(data);
}

export function failure(response: Response<any>, data: Json = 'WIP', code = 400): void {
    response.status(code).send(data);
}
