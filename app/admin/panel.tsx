'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnalyticsPanel from './analytics';

type Inquiry = { id: string; name: string; email: string; company: string | null; phone: string | null; product: string | null; quantity: string | null; message: string; isRead: boolean; createdAt: string };
type Product = { slug: string; name: string; imageUrls: string[]; imageUrl: string | null; category: string | null };
type Category = { id: string; name: string; position: number; productCount: number };

export default function AdminPanel({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(authenticated);
  const [tab, setTab] = useState<'inquiries' | 'products' | 'analytics'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryDraft, setCategoryDraft] = useState('');
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [query, setQuery] = useState('');
  const [productPage, setProductPage] = useState(0);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const [inquiryResponse, productResponse, categoryResponse] = await Promise.all([fetch('/api/admin/inquiries'), fetch('/api/admin/products'), fetch('/api/admin/categories')]);
    if ([inquiryResponse, productResponse, categoryResponse].some(response => response.status === 401)) { setLoggedIn(false); return; }
    const inquiryData = await inquiryResponse.json(); const productData = await productResponse.json(); const categoryData = await categoryResponse.json();
    if (!inquiryResponse.ok || !productResponse.ok || !categoryResponse.ok) throw new Error(inquiryData.error || productData.error || categoryData.error || '后台数据加载失败。');
    setInquiries(inquiryData); setProducts(productData); setCategories(categoryData);
    setSelectedCategory(current => current && categoryData.some((item: Category) => item.name === current) ? current : categoryData[0]?.name || '');
  }
  useEffect(() => { if (loggedIn) { void Promise.resolve().then(load).catch(error => setNotice(error.message)); } }, [loggedIn]);
  useEffect(() => {
    if (!selectedInquiry) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedInquiry(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedInquiry]);

  async function login(form: FormData) {
    setBusy(true); setNotice('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.get('username'), password: form.get('password') }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) { setNotice(result.error || '登录失败，请检查账号和密码。'); return; }
    setLoggedIn(true); router.refresh();
  }
  async function logout() { await fetch('/api/admin/session', { method: 'DELETE' }); setLoggedIn(false); router.refresh(); }
  async function api(url: string, method: string, body?: unknown) {
    const response = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || '操作未能完成，请稍后重试。');
    return result;
  }
  async function setInquiryRead(item: Inquiry, isRead: boolean) {
    try {
      await api('/api/admin/inquiries', 'PATCH', { id: item.id, isRead });
      setInquiries(rows => rows.map(row => row.id === item.id ? { ...row, isRead } : row));
      setSelectedInquiry(current => current?.id === item.id ? { ...current, isRead } : current);
      return true;
    } catch (error) { setNotice(error instanceof Error ? error.message : '留言状态更新失败。'); return false; }
  }
  async function openInquiry(item: Inquiry) { setSelectedInquiry(item); if (!item.isRead) await setInquiryRead(item, true); }
  async function deleteInquiry(item: Inquiry) { if (!window.confirm(`确定删除来自 ${item.name} 的留言吗？`)) return; try { await api('/api/admin/inquiries', 'DELETE', { id: item.id }); setInquiries(rows => rows.filter(row => row.id !== item.id)); setSelectedInquiry(null); } catch (error) { setNotice(error instanceof Error ? error.message : '留言删除失败。'); } }
  async function saveProduct(product: Product) { const originalCategory = products.find(row => row.slug === product.slug)?.category; setBusy(true); setNotice(''); try { await api(`/api/admin/products/${encodeURIComponent(product.slug)}`, 'PATCH', { name: product.name, category: product.category, imageUrls: product.imageUrls }); if (originalCategory && product.category && originalCategory !== product.category) setCategories(rows => rows.map(category => category.name === originalCategory ? { ...category, productCount: Math.max(0, category.productCount - 1) } : category.name === product.category ? { ...category, productCount: category.productCount + 1 } : category)); setNotice(`「${product.name}」已保存。`); } catch (error) { setNotice(error instanceof Error ? error.message : '产品保存失败。'); } finally { setBusy(false); } }
  async function createCategory(form: FormData) {
    const name = String(form.get('name') || '').trim(); if (!name) return;
    try { const category = await api('/api/admin/categories', 'POST', { name }); setCategories(rows => [...rows, category].sort((a, b) => a.position - b.position)); setSelectedCategory(category.name); setNotice('分类已添加。'); }
    catch (error) { setNotice(error instanceof Error ? error.message : '分类添加失败。'); }
  }
  async function renameCategory(category: Category) {
    const name = categoryDraft.trim(); if (!name || name === category.name) { setEditingCategory(null); return; }
    try { await api(`/api/admin/categories/${category.id}`, 'PATCH', { name }); setCategories(rows => rows.map(item => item.id === category.id ? { ...item, name } : item)); setProducts(rows => rows.map(item => item.category === category.name ? { ...item, category: name } : item)); if (selectedCategory === category.name) setSelectedCategory(name); setEditingCategory(null); setNotice('分类名称及关联产品已更新。'); }
    catch (error) { setNotice(error instanceof Error ? error.message : '分类修改失败。'); }
  }
  async function deleteCategory(category: Category) {
    if (!window.confirm(`确定删除分类“${category.name}”吗？请先移动或删除该分类下的产品。`)) return;
    try { await api(`/api/admin/categories/${category.id}`, 'DELETE'); const remaining = categories.filter(item => item.id !== category.id); setCategories(remaining); if (selectedCategory === category.name) setSelectedCategory(remaining[0]?.name || ''); setNotice('分类已删除。'); }
    catch (error) { setNotice(error instanceof Error ? error.message : '分类删除失败。'); }
  }
  async function deleteProduct(product: Product) {
    if (!window.confirm(`确定从网站产品目录中删除“${product.name}”吗？`)) return;
    try { await api(`/api/admin/products/${encodeURIComponent(product.slug)}`, 'DELETE'); setProducts(rows => rows.filter(item => item.slug !== product.slug)); setCategories(rows => rows.map(item => item.name === product.category ? { ...item, productCount: Math.max(0, item.productCount - 1) } : item)); setNotice('产品已从网站目录中删除。'); }
    catch (error) { setNotice(error instanceof Error ? error.message : '产品删除失败。'); }
  }
  async function addProduct(form: FormData) {
    const name = String(form.get('name') || '').trim(); const files = form.getAll('images').filter((item): item is File => item instanceof File && item.size > 0);
    if (!name || !selectedCategory || files.length < 1) { setNotice('请填写产品名称并至少选择一张图片。'); return; }
    setBusy(true); setNotice('正在上传产品图片…');
    try {
      const imageUrls: string[] = [];
      for (const file of files) imageUrls.push(await uploadFile(file));
      const product = await api('/api/admin/products', 'POST', { name, category: selectedCategory, imageUrls });
      setProducts(rows => [...rows, product].sort((a, b) => a.name.localeCompare(b.name)));
      setCategories(rows => rows.map(category => category.name === selectedCategory ? { ...category, productCount: category.productCount + 1 } : category));
      setShowNewProduct(false); setNotice('产品已添加到网站。');
    } catch (error) { setNotice(error instanceof Error ? error.message : '产品添加失败。'); }
    finally { setBusy(false); }
  }
  async function uploadFile(file: File) {
    const form = new FormData(); form.set('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form }); const result = await response.json();
    if (!response.ok) throw new Error(result.error || '图片上传失败。');
    return result.url as string;
  }
  async function upload(product: Product, file?: File) {
    if (!file) return;
    setBusy(true); setNotice('正在上传图片…');
    try { const url = await uploadFile(file); setProducts(rows => rows.map(row => row.slug === product.slug ? { ...row, imageUrls: [...row.imageUrls, url] } : row)); setNotice('图片已上传，请保存产品以发布更改。'); }
    catch (error) { setNotice(error instanceof Error ? error.message : '图片上传失败。'); }
    finally { setBusy(false); }
  }
  const filteredProducts = useMemo(() => products.filter(item => item.category === selectedCategory && `${item.name} ${item.category || ''}`.toLowerCase().includes(query.toLowerCase())), [products, selectedCategory, query]);
  const visibleProducts = filteredProducts.slice(productPage * 24, productPage * 24 + 24);

  if (!loggedIn) return <section className="admin-login"><span className="admin-kicker">XIECHU / 管理后台</span><h1>管理<br />工作台</h1><p>登录后即可查看客户留言，并管理网站产品图片。</p><form action={login}><label>用户名<input name="username" autoComplete="username" required /></label><label>密码<input name="password" type="password" autoComplete="current-password" required /></label><button className="admin-primary" disabled={busy}>{busy ? '正在登录…' : '登录 →'}</button>{notice && <p className="admin-notice">{notice}</p>}</form></section>;

  const unread = inquiries.filter(item => !item.isRead).length;
  const filteredInquiries = inquiries.filter(item => inquiryFilter === 'all' || (inquiryFilter === 'unread' ? !item.isRead : item.isRead));
  return <div className="admin-dashboard"><header className="admin-head"><Link className="admin-brand" href="/"><img src="/images/xiechu-brand-mark.png" alt="" /><span className="admin-brand-copy">XIECHU<span>.</span><small>管理后台</small></span></Link><div><a href="/" target="_blank" rel="noreferrer">查看网站 ↗</a><button onClick={logout}>退出登录</button></div></header><div className="admin-workspace"><aside className="admin-sidebar"><span className="admin-sidebar-label">工作区</span><button className={tab === 'inquiries' ? 'selected' : ''} onClick={() => setTab('inquiries')}><span className="admin-nav-icon">✉</span><span>客户留言<small>咨询与项目需求</small></span><i>{unread}</i></button><button className={tab === 'analytics' ? 'selected' : ''} onClick={() => setTab('analytics')}><span className="admin-nav-icon">▤</span><span>访问统计<small>流量与点击数据</small></span><i>↗</i></button><button className={tab === 'products' ? 'selected' : ''} onClick={() => setTab('products')}><span className="admin-nav-icon">▧</span><span>产品管理<small>产品图片与目录</small></span><i>{products.length}</i></button><div className="admin-sidebar-foot"><span className="admin-live">● 安全管理</span><p>XIECHU<br />包装系统</p></div></aside><div className="admin-main"><div className="admin-title"><div><span className="admin-kicker">管理控制台</span><h1>{tab === 'inquiries' ? '客户留言' : tab === 'products' ? '产品管理' : '访问统计'}</h1><p>{tab === 'inquiries' ? '查看并跟进客户提交的包装项目需求。' : tab === 'products' ? '管理网站产品目录、分类及产品图片。' : '查看网站访问、页面浏览和客户互动数据。'}</p></div></div>
    {notice && <div className="admin-banner" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
    {tab === 'analytics' ? <AnalyticsPanel /> : tab === 'inquiries' ? <section className="admin-inbox"><div className="admin-section-heading"><div><span className="admin-kicker">客户消息</span><h2>项目留言</h2></div><span>共 {inquiries.length} 条</span></div><div className="inquiry-filters" aria-label="筛选留言">{(['all', 'unread', 'read'] as const).map(filter => <button key={filter} className={inquiryFilter === filter ? 'active' : ''} onClick={() => setInquiryFilter(filter)}>{filter === 'all' ? '全部留言' : filter === 'unread' ? '未读' : '已读'}<span>{filter === 'all' ? inquiries.length : filter === 'unread' ? unread : inquiries.length - unread}</span></button>)}</div>{filteredInquiries.length === 0 ? <div className="admin-empty">{inquiries.length === 0 ? '暂无客户留言，网站收到的新咨询会显示在这里。' : `暂无${inquiryFilter === 'unread' ? '未读' : '已读'}留言。`}</div> : filteredInquiries.map(item => <article className={`inquiry-card ${item.isRead ? 'read' : 'unread'}`} key={item.id}><div className="inquiry-card-head"><div className="inquiry-person"><span className="inquiry-avatar">{item.name.trim().charAt(0).toUpperCase()}</span><div><span className="admin-date">{new Date(item.createdAt).toLocaleString('zh-CN')}</span><h3>{item.name}</h3><div className="inquiry-contact">{item.email}{item.company && ` · ${item.company}`}</div></div></div><div className="inquiry-card-tools"><span className={`inquiry-status ${item.isRead ? 'is-read' : 'is-unread'}`}><i />{item.isRead ? '已读' : '未读'}</span><button className="inquiry-detail-button" onClick={() => openInquiry(item)}>查看详情 <span>↗</span></button></div></div><div className="inquiry-summary">{item.product && <span>{item.product}</span>}{item.quantity && <span>预估数量：{item.quantity}</span>}<p>{item.message}</p></div></article>)}</section> : <section className="catalog-management"><aside className="category-panel"><div className="category-panel-heading"><div><span className="admin-kicker">产品目录结构</span><h2>产品分类</h2></div><span>{categories.length}</span></div><form className="category-create" action={createCategory}><input name="name" required maxLength={80} placeholder="输入新分类名称" aria-label="输入新分类名称" /><button aria-label="添加分类">＋</button></form><nav className="category-list" aria-label="产品分类">{categories.map(category => <div className={`category-item ${selectedCategory === category.name ? 'selected' : ''}`} key={category.id}>{editingCategory === category.id ? <div className="category-rename"><input autoFocus value={categoryDraft} onChange={event => setCategoryDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); void renameCategory(category); } if (event.key === 'Escape') setEditingCategory(null); }} /><button title="保存分类名称" onClick={() => renameCategory(category)}>✓</button><button title="取消" onClick={() => setEditingCategory(null)}>×</button></div> : <><button className="category-select" onClick={() => { setSelectedCategory(category.name); setProductPage(0); setQuery(''); setShowNewProduct(false); }}><span>{category.name}</span><small>{category.productCount}</small></button><div className="category-actions"><button title="修改分类" aria-label={`修改分类：${category.name}`} onClick={() => { setEditingCategory(category.id); setCategoryDraft(category.name); }}>✎</button><button title="删除分类" aria-label={`删除分类：${category.name}`} onClick={() => deleteCategory(category)}>×</button></div></>}</div>)}</nav></aside><div className="category-products"><div className="admin-section-heading category-products-heading"><div><span className="admin-kicker">分类下的产品</span><h2>{selectedCategory || '请选择一个分类'}</h2><p>管理此分类中的产品名称和图片。</p></div>{selectedCategory && <button className="admin-primary" onClick={() => setShowNewProduct(value => !value)}>{showNewProduct ? '取消' : '＋ 添加产品'}</button>}</div>{showNewProduct && <form className="new-product-form" action={addProduct}><label>产品名称<input name="name" required maxLength={180} placeholder="请输入产品名称" /></label><label>产品图片<input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple required disabled={busy} /></label><p>可上传 JPG、PNG、WebP 或 AVIF 图片，单张不超过 10 MB。所属分类：<strong>{selectedCategory}</strong></p><button className="admin-primary" disabled={busy}>{busy ? '正在上传…' : '创建产品'}</button></form>}{selectedCategory && <div className="category-product-toolbar"><label className="admin-search">⌕ <input value={query} onChange={event => { setQuery(event.target.value); setProductPage(0); }} placeholder="搜索此分类" /></label><span>共 {filteredProducts.length} 个产品</span></div>}{visibleProducts.map(product => <ProductEditor key={product.slug} product={product} categories={categories} disabled={busy} onChange={next => setProducts(rows => rows.map(row => row.slug === next.slug ? next : row))} onUpload={file => upload(product, file)} onSave={() => saveProduct(product)} onDelete={() => deleteProduct(product)} />)}{selectedCategory && filteredProducts.length === 0 && !showNewProduct && <div className="admin-empty">此分类暂无产品，可在上方添加第一款产品。</div>}{selectedCategory && filteredProducts.length > 24 && <div className="admin-pagination"><span>第 {productPage * 24 + 1}–{Math.min((productPage + 1) * 24, filteredProducts.length)} 条，共 {filteredProducts.length} 条</span><div><button disabled={productPage === 0} onClick={() => setProductPage(page => page - 1)}>← 上一页</button><button disabled={(productPage + 1) * 24 >= filteredProducts.length} onClick={() => setProductPage(page => page + 1)}>下一页 →</button></div></div>}</div></section>}
    </div></div>{selectedInquiry && <div className="inquiry-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedInquiry(null); }}><section className="inquiry-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="inquiry-detail-title"><header><div><span className="admin-kicker">留言详情</span><span className={`inquiry-status ${selectedInquiry.isRead ? 'is-read' : 'is-unread'}`}><i />{selectedInquiry.isRead ? '已读' : '未读'}</span></div><button aria-label="关闭详情" onClick={() => setSelectedInquiry(null)}>×</button></header><h2 id="inquiry-detail-title">{selectedInquiry.name}</h2><time>{new Date(selectedInquiry.createdAt).toLocaleString('zh-CN')}</time><dl><div><dt>邮箱</dt><dd><a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a></dd></div>{selectedInquiry.company && <div><dt>公司</dt><dd>{selectedInquiry.company}</dd></div>}{selectedInquiry.phone && <div><dt>电话 / WhatsApp</dt><dd>{selectedInquiry.phone}</dd></div>}{selectedInquiry.product && <div><dt>感兴趣的包装</dt><dd>{selectedInquiry.product}</dd></div>}{selectedInquiry.quantity && <div><dt>预估数量</dt><dd>{selectedInquiry.quantity}</dd></div>}</dl><div className="inquiry-detail-message"><span className="admin-kicker">项目需求</span><p>{selectedInquiry.message}</p></div><footer><button className="admin-secondary" onClick={() => setInquiryRead(selectedInquiry, !selectedInquiry.isRead)}>{selectedInquiry.isRead ? '标记为未读' : '标记为已读'}</button><a className="admin-primary" href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent('Re: packaging inquiry')}`}>发送邮件回复 ↗</a><button className="inquiry-delete-detail" onClick={() => deleteInquiry(selectedInquiry)}>删除留言</button></footer></section></div>}</div>;
}

function ProductEditor({ product, categories, disabled, onChange, onUpload, onSave, onDelete }: { product: Product; categories: Category[]; disabled: boolean; onChange: (product: Product) => void; onUpload: (file?: File) => void; onSave: () => void; onDelete: () => void }) {
  return <article className="product-editor"><div className="product-editor-title"><label>产品名称<input value={product.name} onChange={event => onChange({ ...product, name: event.target.value })} /></label><label className="product-category-select">所属分类<select value={product.category || ""} onChange={event => onChange({ ...product, category: event.target.value })}>{categories.map(category => <option value={category.name} key={category.id}>{category.name}</option>)}</select></label></div><div className="admin-image-list">{product.imageUrls.map((url, index) => <div className="admin-image" key={url}><img src={url} alt={`${product.name} 图片 ${index + 1}`} /><button className="remove" type="button" title="移除此图片" aria-label="移除此图片" disabled={product.imageUrls.length === 1} onClick={() => onChange({ ...product, imageUrls: product.imageUrls.filter((_, imageIndex) => imageIndex !== index) })}>×</button>{index > 0 && <button className="cover" type="button" title="设为封面图片" onClick={() => onChange({ ...product, imageUrls: [url, ...product.imageUrls.filter(image => image !== url)] })}>设为封面</button>}<small>{index === 0 ? '封面图片' : `图片 ${index + 1}`}</small></div>)}<label className="admin-image-upload">＋<span>添加图片</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={disabled} onChange={event => { onUpload(event.target.files?.[0]); event.currentTarget.value = ''; }} /></label></div><div className="product-editor-actions"><span>支持 JPG、PNG、WebP 或 AVIF，单张不超过 10 MB</span><div><button className="product-delete-button" onClick={onDelete} disabled={disabled}>删除产品</button><button className="admin-primary" onClick={onSave} disabled={disabled}>保存产品</button></div></div></article>;
}
