/**
 * Stores interfaces used by ECMS
 * @packageDocumentation
 */
import type { Request } from "express";

/**
 * An Express Request object with a type annotation for req.body
 */
export type RequestWithBody<T> = Request<Record<string, string>, any, Partial<T>>