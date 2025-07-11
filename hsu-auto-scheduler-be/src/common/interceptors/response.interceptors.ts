import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type ApiResponseInput<T> = {
  message?: string;
  data?: T | string;
};

type ApiResponseOutput<T> = {
  success: boolean;
  message: string;
  data: T | string | null;
};

@Injectable()
// NestInterceptor의 제네릭 첫번째 인자는 Controller에서 반환하는 값, 두번째 인자는 해당 인터셉터에서 반환할 값
export class ResponseInterceptor<T>
  implements NestInterceptor<ApiResponseInput<T>, ApiResponseOutput<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<ApiResponseInput<T>>,
  ):
    | Observable<ApiResponseOutput<T>>
    | Promise<Observable<ApiResponseOutput<T>>> {
    return next.handle().pipe(
      map((res) => ({
        success: true,
        message: res.message ?? '요청이 성공적으로 처리되었습니다',
        data: res.data ?? null,
      })),
    );
  }
}
