import { BlobAccessError, BlobClientTokenExpiredError, BlobError, BlobFileTooLargeError, BlobServiceNotAvailable, BlobServiceRateLimited, BlobStoreNotFoundError, BlobStoreSuspendedError, put } from '@vercel/blob';
import { isAdmin } from '../../../lib/auth';

export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ error: '登录状态已失效，请重新登录。' }, { status: 401 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: '请选择要上传的图片文件。' }, { status: 400 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: '未检测到 Vercel Blob 上传令牌。请在当前运行环境配置 BLOB_READ_WRITE_TOKEN 后重启服务。' }, { status: 503 });
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.type)) return Response.json({ error: '图片格式暂不支持，请使用 JPG、PNG、WebP 或 AVIF。' }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return Response.json({ error: '图片不能超过 10 MB，请压缩后重试。' }, { status: 413 });
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'product-image';
    const blob = await put(`products/${Date.now()}-${safeName}`, file, { access: 'public', addRandomSuffix: true, contentType: file.type });
    return Response.json({ url: blob.url });
  } catch (error) {
    const errorName = error instanceof Error ? error.constructor.name : 'UnknownError';
    const causeCode = error instanceof Error && error.cause && typeof error.cause === 'object' && 'code' in error.cause && typeof error.cause.code === 'string' ? error.cause.code : '';
    console.error('Image upload failed:', errorName, causeCode);
    let message = '图片上传失败，请检查网络连接和 Vercel Blob 存储配置。';
    if (error instanceof BlobAccessError) message = 'Blob 访问被拒绝，请确认 BLOB_READ_WRITE_TOKEN 属于当前 Blob 存储且具有读写权限。';
    else if (error instanceof BlobClientTokenExpiredError) message = 'Vercel Blob 令牌已失效，请在项目环境变量中更新 BLOB_READ_WRITE_TOKEN 并重启或重新部署。';
    else if (error instanceof BlobStoreNotFoundError) message = '找不到对应的 Vercel Blob 存储，请检查令牌是否来自当前项目的 Blob Store。';
    else if (error instanceof BlobStoreSuspendedError) message = 'Vercel Blob 存储当前不可用，请检查 Vercel 项目中的存储状态。';
    else if (error instanceof BlobFileTooLargeError) message = '图片文件超过 Vercel Blob 允许的大小，请压缩后重试。';
    else if (error instanceof BlobServiceRateLimited) message = '图片上传请求过于频繁，请稍等片刻后重试。';
    else if (error instanceof BlobServiceNotAvailable) message = 'Vercel Blob 服务暂时不可用，请稍后重试。';
    else if (error instanceof BlobError && error.message.includes('Cannot use public access on a private store')) message = '当前关联的是 Private Blob Store，不能以公开方式上传。产品图片需要供网站访客直接查看，请新建 Public Blob Store 并连接到项目，然后用新存储生成的 BLOB_READ_WRITE_TOKEN 更新本地和 Vercel 环境。Blob Store 的访问模式创建后不能切换。';
    else if (error instanceof Error && error.message.includes('OIDC is enabled')) message = 'Vercel 项目启用了 OIDC，但当前凭据不匹配。请检查 Vercel Blob Store 与项目环境绑定，或更新读写令牌。';
    else if (error instanceof BlobError) message = `Vercel Blob 返回：${error.message.replace(/^Vercel Blob:\s*/, '').replace(/[\r\n\t]/g, ' ').slice(0, 220)}`;
    else if (error instanceof TypeError || causeCode) message = '服务器无法连接到 Vercel Blob 上传服务，请检查网络代理、防火墙及 Vercel API 连通性。';
    return Response.json({ error: `${message}（错误类型：${errorName}${causeCode ? `，${causeCode}` : ''}）` }, { status: 503 });
  }
}
