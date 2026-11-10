type PackagingProduct = { category: string; specifications: { label: string; value: string }[] };

const applicationCopy: Record<string, string> = {
  'Glass Jar': 'Glass primary packaging for creams, balms and body care. Review capacity, neck finish, lid construction and lining requirements against your formulation and filling process.',
  'Essential Oil Bottle': 'Glass bottles for serums, essential oils and other liquid formulations. Review nominal capacity, neck finish and the selected dropper, pump or cap configuration, including component fit and dispensing requirements.',
  'Airless Bottle & Jar': 'Airless packaging formats for skincare and personal care. Review capacity, actuator configuration, component fit and filling requirements before confirming the decoration and assembly specification.',
  'Foam Bottle': 'Foam-pump packaging for cleansing and personal care formulations. Review bottle capacity, neck fit and pump configuration, then evaluate foaming performance with representative samples and the intended formulation.',
  'Deodorant Bottle': 'Deodorant packaging for personal care applications. Review capacity, dispensing mechanism, component fit and filling conditions to establish the appropriate container and closure specification.',
  'Plastic jar': 'Plastic jar packaging for skincare and body care. Confirm the specified resin, capacity, wall construction and closure configuration, with decoration and lining options reviewed for the selected format.',
  'Bamboo Bottle & Jar': 'Containers with bamboo closures or decorative components for cosmetic packaging. Confirm the container material, capacity, closure seal and component fit, allowing for natural variation in bamboo color and grain.',
  'Plastic Bottle': 'Plastic bottles for liquid skincare, cleansing and personal care products. Review the resin, capacity, neck finish and closure or pump configuration against formula and filling requirements.',
  'Perfume bottles': 'Glass fragrance packaging with sprayer and closure configurations dependent on the selected bottle. Review capacity, neck finish, sealing requirements and decoration before confirming the complete assembly.',
  'Aluminum Jar': 'Aluminum jars and tins for cosmetic and personal care packaging. Review capacity, lid fit, internal finish and any lining requirements, with formulation compatibility assessed using representative samples.',
  'Plastic Tube': 'Cosmetic tube packaging for creams, cleansers and personal care products. Review diameter, capacity, material construction, closure and artwork, including the filling and end-sealing requirements.',
};

export function describePackaging(product: PackagingProduct): string {
  const introduction = applicationCopy[product.category] || 'Primary packaging for cosmetic and personal care applications. Review the container, closure and decoration specification with our team.';
  const size = product.specifications.find(spec => /^(size|capacity|volume|tube capacity)$/i.test(spec.label.trim().replace(/:$/, '')));
  const material = product.specifications.find(spec => /^material$/i.test(spec.label.trim().replace(/:$/, '')));
  const details = [
    material && material.value.length <= 70 ? 'Listed material: ' + material.value.replace(/[.\s]+$/, '') + '.' : '',
    size && size.value.length <= 90 ? 'Listed sizes: ' + size.value.replace(/[.\s]+$/, '') + '.' : '',
  ].filter(Boolean).join(' ');
  return introduction + (details ? ' ' + details : '');
}
