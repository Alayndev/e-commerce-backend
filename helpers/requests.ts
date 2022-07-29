import type { NextApiRequest } from "next";

export function getLimitAndOffset(req: NextApiRequest, maxLimit, maxOffset) {
  const queryLimit = parseInt(req.query.limit as string);

  const finalLimit =
    queryLimit <= maxLimit && queryLimit != 0 ? queryLimit : maxLimit;

  const queryOffset = parseInt(req.query.offset as string);

  const finalOffset = queryOffset < maxOffset ? queryOffset : 0;

  return { finalLimit, finalOffset };
}
