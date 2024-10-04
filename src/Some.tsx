// import { useEffect, useRef, useState } from 'react';
// function darkenColor(rgb: string, percentage: number): string {
// 	const match = rgb.match(/\d+/g);
// 	if (!match || match.length !== 3) {
// 		throw new Error('Invalid RGB format');
// 	}

// 	const [r, g, b] = match.map(Number);
// 	const darkenValue = (value: number) => Math.max(0, Math.min(255, value * (1 - percentage / 100)));

// 	const darkenedR = darkenValue(r);
// 	const darkenedG = darkenValue(g);
// 	const darkenedB = darkenValue(b);

// 	return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
// }
// function App() {
// 	const [svgContent, setSvgContent] = useState<string | null | TrustedHTML>(null);
// 	const [svgContentTwo, setSvgContentTwo] = useState<string | null | TrustedHTML | undefined>(null);
// 	const [targets, setTargets] = useState<Record<any, any>[]>([]);
// 	const [count, setCount] = useState(0);
// 	const [id, setId] = useState('');
// 	const [data, setData] = useState<{ id: number | string | null; isOpen: boolean }>({
// 		id: null,
// 		isOpen: false,
// 	});
// 	const ref = useRef<HTMLDivElement>(null);
// 	const [isOpen, setIsOpen] = useState(false);

// 	///----------------------------
// 	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = event.target.files?.[0];
// 		if (file && file.type === 'image/svg+xml') {
// 			const reader = new FileReader();
// 			reader.onload = () => {
// 				setSvgContent(reader.result as string);
// 			};
// 			reader.readAsText(file);
// 		} else {
// 			alert('Please upload a valid SVG file.');
// 		}
// 	};

// 	///----------------------------

// 	const handleSvgClick = (event: React.MouseEvent<HTMLDivElement>) => {
// 		const target = event.target as SVGElement;
// 		const styles = getComputedStyle(target);

// 		if (target.tagName !== 'rect' && target.tagName !== 'polygon') {
// 			return;
// 		}

// 		if (!target.hasAttribute('data-id')) {
// 			setCount((prev) => prev + 1);
// 			target.setAttribute('data-id', `${count}`);
// 			target.setAttribute('data-color', styles.fill!);
// 			target.setAttribute('data-data', JSON.stringify({ id: count, text: 'AA' }));
// 			setTargets((prev) => [
// 				...prev,
// 				{
// 					target: target,
// 					index: count,
// 				},
// 			]);
// 		}
// 		setData({
// 			id: target.getAttribute('data-id'),
// 			isOpen: false,
// 		});
// 		setId(target.getAttribute('data-id') ?? '');
// 		setIsOpen(true);

// 		target.style.fill = darkenColor(styles.fill!, 10);
// 		const bbox = (target as SVGRectElement | SVGPolygonElement).getBBox();

// 		const svg = target.parentNode;
// 		if (svg) {
// 			// const rec = svg.querySelector(`rect[data-id="${target.getAttribute('data-id')}"]`);
// 			// if (existingText) {
// 			// 	existingText.remove();
// 			// }
// 			console.log(target, svg);
// 			const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
// 			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
// 			text.textContent = '11';
// 			textElement.setAttribute('x', `${bbox.x}`);
// 			textElement.setAttribute('y', `${bbox.y}`);
// 			textElement.style.fill = 'rgb(255, 255, 255)';
// 			textElement.style.color = 'black';
// 			textElement.setAttribute('width', '100');
// 			textElement.setAttribute('height', '100');

// 			// textElement.setAttribute('width', `${bbox.width}`);
// 			// textElement.setAttribute('height', `${bbox.height}`);
// 			// textElement.style.background = 'red';
// 			// textElement.style.display = 'block';
// 			// textElement.setAttribute('background-color', 'red');
// 			// textElement.setAttribute('font-size', '22');
// 			// textElement.setAttribute('fill', 'black');
// 			// textElement.setAttribute('color', 'white');
// 			textElement.setAttribute('data-id', `${target.getAttribute('data-id')}`);
// 			textElement.appendChild(text);

// 			svg.appendChild(textElement);
// 		}
// 	};
// 	const handleSvgClickTwo = (event: React.MouseEvent<HTMLDivElement>) => {
// 		const target = event.target as SVGElement;
// 		// console.log(target);
// 	};

// 	useEffect(() => {
// 		const el = ref.current?.querySelector('svg');
// 		const e = el?.querySelector(`[data-id="${id}"]`) as SVGAElement;

// 		if (!isOpen) {
// 			if (e) {
// 				e.style.fill = e.getAttribute('data-color')!;
// 			}
// 		}
// 	}, [id, ref, isOpen]);

// 	// useEffect(() => {
// 	// 	const el = ref.current?.querySelector('svg');
// 	// 	const e = el?.querySelector(`[data-id="${id}"]`) as SVGAElement | SVGPolygonElement;
// 	// 	const text = el?.querySelector(`text[data-id="${id}"]`);

// 	// 	if (el) {
// 	// 		el.style.position = 'relative';
// 	// 		e?.addEventListener('mouseenter', () => {
// 	// 			const svg = text;
// 	// 			console.log(svg);

// 	// 			console.log(el);
// 	// 			if (svg) {
// 	// 				const existingText = svg.querySelector(`text[data-id="${e.getAttribute('data-id')}"]`);
// 	// 				if (existingText) {
// 	// 					existingText.remove();
// 	// 				}

// 	// 				const textElement = document.createElement('span');

// 	// 				// // textElement.setAttribute('x', `${bbox.x + bbox.width / 2}`);
// 	// 				// // textElement.setAttribute('y', `${bbox.y + bbox.height / 2}`);

// 	// 				textElement.setAttribute('font-size', '22');
// 	// 				textElement.setAttribute('fill', 'black');
// 	// 				textElement.style.position = 'absolute';
// 	// 				textElement.style.zIndex = '9999';
// 	// 				textElement.style.top = '0';
// 	// 				textElement.style.left = '0';
// 	// 				textElement.style.display = 'block';
// 	// 				textElement.style.width = '100px';
// 	// 				textElement.style.height = '100px';
// 	// 				textElement.style.backgroundColor = 'white';
// 	// 				textElement.setAttribute('data-id', `${e.getAttribute('data-id')}`);
// 	// 				textElement.textContent = `${JSON.parse(e.getAttribute('data-data') || '{}').text}`;

// 	// 				svg.appendChild(textElement);
// 	// 			}
// 	// 		});

// 	// 		// e?.addEventListener('mouseleave', () => {
// 	// 		// 	const svg = text;

// 	// 		// 	if (svg) {
// 	// 		// 		const existingText = svg.querySelector(`span[data-id="${e.getAttribute('data-id')}"]`);
// 	// 		// 		if (existingText) {
// 	// 		// 			existingText.remove();
// 	// 		// 		}
// 	// 		// 	}
// 	// 		// });
// 	// 	}
// 	// }, [id, ref]);

// 	return (
// 		<div className="flex flex-col items-center justify-start bg-slate-300 h-full w-full relative">
// 			<input type="file" onChange={onChange} />
// 			{isOpen && (
// 				<div className="absolute w-full h-full  flex items-center justify-center z-[9999999] ">
// 					<div className="absolute  bg-red-400 w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
// 						{data.isOpen && <div>some</div>}
// 						{data.id}
// 						<button
// 							onClick={() => {
// 								setIsOpen(false);
// 							}}
// 						>
// 							close
// 						</button>
// 					</div>
// 				</div>
// 			)}
// 			<button
// 				onClick={() => {
// 					setSvgContentTwo(ref?.current?.getHTML());
// 					// console.log(
// 					// 	JSON.stringify({
// 					// 		html: refCopy?.current?.getHTML(),
// 					// 	})
// 					// );
// 					console.log(ref?.current?.getHTML());
// 				}}
// 			>
// 				button
// 			</button>
// 			<div className="flex  gap-4 h-screen flex-col w-screen">
// 				<div className="w-screen h-full border border-red-400 ">
// 					<div ref={ref} dangerouslySetInnerHTML={{ __html: svgContent! }} onClick={handleSvgClick} />
// 				</div>

// 				<div className="w-screen h-screen border border-red-400">
// 					<div dangerouslySetInnerHTML={{ __html: svgContentTwo! }} onClick={handleSvgClickTwo} />
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default App;


const Some = () => {
	return <div>Some</div>;
};

export default Some;
