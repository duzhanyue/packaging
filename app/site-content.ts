export const workflow = [
  { number: '01', title: 'Idea', description: 'Brand customers tell us their idea or show us any photo about what they want to make.', image: 'idea', alt: 'Packaging inspiration with a clear storage jar' },
  { number: '02', title: '2D Drawing', description: 'Brand customers tell us their idea or show us any photo about what they want to make.', image: '2d-drawing', alt: 'Designer developing a two-dimensional packaging drawing' },
  { number: '03', title: '3D', description: 'Then we will make a 3D drawing.', image: '3d-design', alt: 'Three-dimensional CAD model of a jar and closure' },
  { number: '04', title: 'Prototype', description: 'Confirm the structure and the function.', image: 'prototype', alt: 'Clear jar prototype for structure and function confirmation' },
  { number: '05', title: 'Mold', description: 'Open a mold as requested by the customer.', image: 'mold', alt: 'Packaging mold and manufacturing equipment' },
  { number: '06', title: 'Sample', description: 'Finally, we will send the sample to brand customers.', image: 'sample', alt: 'Decorated jar samples in a range of colors and finishes' },
];

export const sellerPartners = [
  { title: 'Online Seller', audience: 'Amazon, Shopify DTC Brands, Gym & Fitness Clubs', benefits: ['Low MOQ', 'More SKUs', 'High-quality videos and photos'] },
  { title: 'Wholesaler', benefits: ['Stable quality', 'Popular styles', '100% quality assurance & worry-free after-sales', 'Brand authorization'] },
  { title: 'Brand Customer', benefits: ['Dual brand strategy', 'Professional quality control system', 'ODM capability'] },
  { title: 'Factory or Store', benefits: ['Stock availability', 'High quality', 'Low MOQ', 'Flexible shipment and storage'] },
];

export const customOptions = [
  { title: 'Custom color & transparency', short: 'Color', slug: 'violet-dropper', text: 'Create a coordinated collection with a defined color reference, opacity and gloss level. Review the result on the selected substrate through a decorated sample.', checks: ['Color reference & opacity', 'Container and closure coordination', 'Approved physical color sample'] },
  { title: 'Logo & artwork application', short: 'Branding', slug: 'gold-cream-jars', text: 'Translate your brand identity into screen printing, hot stamping or labeling. The print area, artwork detail and container geometry guide the appropriate process.', checks: ['Artwork file & print area', 'Placement, colors & registration', 'Decoration sample approval'] },
  { title: 'Capacity & dimensional requirements', short: 'Capacity', slug: 'bamboo-collection', text: 'Select a nominal capacity and review the dimensions against your formula, filling equipment and secondary packaging. Existing sizes and new development are assessed separately.', checks: ['Nominal capacity & fill requirements', 'Height, diameter & neck finish', 'Filling and packing evaluation'] },
  { title: 'Surface treatment & finish', short: 'Finishes', slug: 'jt-273', text: 'Explore frosting, coating or a metallic appearance for the selected design. Process feasibility, coverage and finish expectations depend on the container material.', checks: ['Surface texture & gloss level', 'Material and process feasibility', 'Finish reference & appearance criteria'] },
  { title: 'Closures & dispensing systems', short: 'Components', slug: 'square-dropper', text: 'Complete the pack with a compatible cap, dropper, pump or other dispenser. Review neck fit, sealing, pipette or dip-tube length and dispensing performance.', checks: ['Closure configuration & sealing', 'Pipette or dip-tube specification', 'Fit and application testing'] },
  { title: 'Shape development & tooling', short: 'Structure', slug: 'bamboo-jar', text: 'Submit a drawing, reference sample or structural brief for a custom container or component. Tooling scope, technical feasibility, development samples and costs are reviewed before production.', checks: ['Drawing or reference sample', 'Tooling scope & development plan', 'Prototype and production approval'] },
  { title: 'Material & collection planning', short: 'Materials', slug: 'jt-252', text: 'Compare glass, plastic, aluminum and bamboo-component formats for the intended application. Build a consistent product family while confirming each format’s compatibility and supply requirements.', checks: ['Application-led material selection', 'Coordinated product families', 'Formula compatibility review'] },
];

export const guides = [
  { slug: 'prepare-your-packaging-brief', category: 'PROJECT PLANNING', title: 'How to prepare a useful packaging brief', image: 'bamboo-collection', intro: 'A well-defined brief makes product recommendations and quotations more relevant. Start with how the pack needs to perform, then define its appearance.', sections: [
    ['Start with the application', 'Describe the product, formulation type and filling method. State whether you need a bottle, jar, tube or dispensing format, and whether the project uses an existing container or requires structural development.'],
    ['Specify the complete pack', 'List the material, nominal capacity, dimensions where critical, neck finish and closure. Include a reference photo, drawing or product link. For a dropper or pump, explain the dispensing requirements and any component preferences.'],
    ['Define decoration and order requirements', 'Provide artwork, the intended print area, color references and surface finish. Include estimated quantity, destination and target timing. Ask for sample availability, the quoted scope, packing details and the production schedule to be confirmed for that specific configuration.'],
    ['Create a clear approval reference', 'Record the agreed specification and artwork revision. Review physical samples with your formula and filling team, then retain the approved sample and written requirements as the reference for the order.'],
  ] },
  { slug: 'choosing-bottles-jars-and-closures', category: 'PRODUCT SELECTION', title: 'Choosing the container and closure together', image: 'square-dropper', intro: 'The bottle or jar and its closure form one packaging system. A matching appearance is only the beginning of a successful specification.', sections: [
    ['Match the format to the product', 'Consider formulation characteristics, how the customer uses the product, the filling process and the required dose or access. Compare the relevant jar, dropper, pump, foam or tube formats before narrowing down appearance.'],
    ['Review capacity and component fit', 'Confirm nominal capacity, the intended filling level, neck finish and closure configuration with the selected design. Review container and closure samples together; visual similarity alone does not establish compatibility.'],
    ['Check dispensing and sealing', 'For droppers and pumps, confirm pipette or dip-tube length and dispensing requirements. Review closure fit and sealing with representative components. Your filling or formulation team should evaluate samples using the actual product and intended storage conditions.'],
    ['Approve the complete configuration', 'Document the container, closure, decoration and approved references together. A change to one component may affect fit, appearance or performance, so review changes before confirming the production specification.'],
  ] },
  { slug: 'sample-approval-to-production', category: 'PRODUCTION WORKFLOW', title: 'From approved sample to production order', image: 'gold-cream-jars', intro: 'A sample is most useful when it is connected to a written specification. Define what is being approved and which checks the production order requires.', sections: [
    ['Distinguish sample stages', 'An existing component sample can help review shape, capacity and fit. A decorated sample supports artwork, color and finish approval. For a tooling project, development samples have a separate scope and schedule. Confirm what each sample represents.'],
    ['Agree the approval criteria', 'Record critical dimensions, material, closure fit, artwork revision, print placement and the physical finish reference. Complete the formula and filling evaluations appropriate to the application before authorizing bulk production.'],
    ['Align production and inspection', 'Confirm the order configuration, quantity, production arrangements and agreed inspection scope. Discuss appearance, dimensional, decoration and component checks with the team. Do not assume that one project’s quantity or schedule applies to another design.'],
    ['Plan packing and dispatch', 'Specify protective packing, carton configuration, shipping marks and delivery requirements. Keep the agreed specification, approved samples and any subsequent changes accessible to everyone involved in the order.'],
  ] },
];
