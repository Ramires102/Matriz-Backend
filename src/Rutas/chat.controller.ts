import {
  Controller, Get, Post, Param, Body, UseGuards,
} from '@nestjs/common'
import { ChatService } from '../Services/chat.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { SendMessageDto } from './dto/send-message.dto'
import { AddCommentDto } from './dto/add-comment.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserChats(@Param('userId') userId: string) {
    return this.chatService.getUserChats(Number(userId))
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async startChat(
    @Body() dto: CreateChatDto,
    @CurrentUser() user: any,
  ) {
    return this.chatService.startChat(Number(user.id), dto.recipientId)
  }

  @Get(':chatId/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getMessages(Number(chatId))
  }

  @Post(':chatId/messages')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body() dto: SendMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.chatService.sendMessage(Number(chatId), Number(user.id), dto.content)
  }

  @Post(':chatId/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('chatId') chatId: string,
    @Body() dto: AddCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.chatService.addComment(Number(chatId), Number(user.id), dto.type, dto.content)
  }

  @Get(':chatId/comments')
  @UseGuards(JwtAuthGuard)
  async getComments(@Param('chatId') chatId: string) {
    return this.chatService.getComments(Number(chatId))
  }
}
