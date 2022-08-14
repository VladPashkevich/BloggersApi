import 'reflect-metadata';
import { BloggersService } from '../domain/bloggers-service';
import { BloggersRepository } from '../repositories/bloggers-db-repository';
import { Container } from 'inversify';
import { BloggersController } from '../controllers/bloggers-controller';
import { PostsRepository } from '../repositories/posts-db-repository';
import { PostsService } from '../domain/posts-service';
import { PostsController } from '../controllers/posts-controllers';
import { CommentsRepository } from '../repositories/comments-db-repository';
import { CommentsService } from '../domain/comments-service';
import { CommentsController } from '../controllers/comments-controller';
import { UsersRepository } from '../repositories/users-db-repository';
import { UsersService } from '../domain/users-service';
import { EmailAdapter } from '../adapters/email-adapter';
import { UsersController } from '../controllers/users-controller';
import { EmailManager } from '../mangers/email-managers';
import { AuthService } from '../domain/auth-service';
import { AuthController } from '../controllers/auth-controller';
import { LikeHelperClass } from '../domain/helperclass/like-helperclass';
import { PostsHelper } from '../domain/helperclass/post-helperclass';
import { CommentsHelperClass } from '../domain/helperclass/comment-helperclass';
import { LikesRepository } from '../repositories/likes-repository';
import { JWTService } from '../application/jwt-service';
import { DeleteRepository } from '../repositories/delete-repository';
import { DeleteService } from '../domain/delete-service';
import { DeleteController } from '../controllers/delete-controller';

/*const bloggersRepository = new BloggersRepository();
const bloggersService = new BloggersService(bloggersRepository);

export const bloggersController = new BloggersController(bloggersService);*/

export const container = new Container();

//bloggers
container.bind<BloggersRepository>(BloggersRepository).to(BloggersRepository);
container.bind<BloggersService>(BloggersService).to(BloggersService);
container.bind<BloggersController>(BloggersController).to(BloggersController);

//posts
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsController>(PostsController).to(PostsController);

//comments
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<CommentsController>(CommentsController).to(CommentsController);

//users
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);
container.bind<UsersService>(UsersService).to(UsersService);
container.bind<UsersController>(UsersController).to(UsersController);

//authentical
container.bind<AuthService>(AuthService).to(AuthService);
container.bind<AuthController>(AuthController).to(AuthController);

//email
container.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter);
container.bind<EmailManager>(EmailManager).to(EmailManager);

//helpers
container.bind<LikeHelperClass>(LikeHelperClass).to(LikeHelperClass);
container.bind<PostsHelper>(PostsHelper).to(PostsHelper);
container.bind<CommentsHelperClass>(CommentsHelperClass).to(CommentsHelperClass);

//like
container.bind<LikesRepository>(LikesRepository).to(LikesRepository);

//jwt
container.bind<JWTService>(JWTService).to(JWTService);

//delete-data
container.bind<DeleteRepository>(DeleteRepository).to(DeleteRepository);
container.bind<DeleteService>(DeleteService).to(DeleteService);
container.bind<DeleteController>(DeleteController).to(DeleteController);
