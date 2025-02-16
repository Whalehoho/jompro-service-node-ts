import type e from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';

export type Config = {
    host?: string;
    port: number;
};

export type ResponseBody = Record<string, Json> | undefined;

export interface Request<
    Params extends ParamsDictionary | undefined = undefined,
    ResBody extends ResponseBody = undefined,
    ReqBody extends Json | undefined = undefined,
    ReqQuery extends Query | undefined = undefined,
> extends e.Request<Params, ResBody, ReqBody, ReqQuery> {}

export interface Response<ResBody extends ResponseBody = undefined> extends e.Response<ResBody> {}

export type Controller<
    ResBody extends ResponseBody = undefined,
    Params extends ParamsDictionary | undefined = undefined,
    ReqBody extends Json | undefined = undefined,
    ReqQuery extends Query | undefined = undefined,
> = (
    request: Request<Params, ResBody, ReqBody, ReqQuery>,
    response: Response<ResBody>,
    next?: e.NextFunction
) => Promise<any>;
