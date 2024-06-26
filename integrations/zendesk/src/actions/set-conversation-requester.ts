import { getZendeskClient } from 'src/client'
import * as bp from '.botpress'

type ZendeskClient = ReturnType<typeof getZendeskClient>

const requesterExists = async (client: ZendeskClient, requesterId: string) => {
  try {
    const { role } = await client.getUser(requesterId)
    return role === 'end-user'
  } catch (e) {
    return false
  }
}

export const setConversationRequester: bp.IntegrationProps['actions']['setConversationRequester'] = async ({
  input,
  client,
  ctx,
}) => {
  const zendeskClient = getZendeskClient(ctx.configuration)
  const exists = await requesterExists(zendeskClient, input.requesterId)
  if (!exists) {
    throw new Error(`Requester ${input.requesterId} does not exist`)
  }

  await client.updateConversation({
    id: input.conversationId,
    tags: {
      requesterId: input.requesterId,
    },
  })

  return {}
}
