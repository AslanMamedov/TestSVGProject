import { useEffect, useRef, useState } from 'react';
function darkenColor(rgb: string, percentage: number): string {
	const match = rgb.match(/\d+/g);
	if (!match || match.length !== 3) {
		throw new Error('Invalid RGB format');
	}

	const [r, g, b] = match.map(Number);
	const darkenValue = (value: number) => Math.max(0, Math.min(255, value * (1 - percentage / 100)));

	const darkenedR = darkenValue(r);
	const darkenedG = darkenValue(g);
	const darkenedB = darkenValue(b);

	return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
}
function App() {
	const [svgContent, setSvgContent] = useState<string | null | TrustedHTML>(null);
	const [svgContentTwo, setSvgContentTwo] = useState<string | null | TrustedHTML | undefined>(null);
	// const [targets, setTargets] = useState<Record<string, string>[]>([])
	const [isShowPopup, setIsShowPopup] = useState(false);
	const [count, setCount] = useState(1);
	const [id, setId] = useState('');
	const [position, setPosition] = useState<Record<string, string>>({});
	const [data, setData] = useState<{ id: number | string | null; isOpen: boolean }>({
		id: null,
		isOpen: false,
	});
	const [isOpen, setIsOpen] = useState(false);
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type === 'image/svg+xml') {
			const reader = new FileReader();
			reader.onload = () => {
				setSvgContent(reader.result as string);
			};
			reader.readAsText(file);
		} else {
			alert('Please upload a valid SVG file.');
		}
	};
	const ref = useRef<HTMLDivElement>(null);
	const handleSvgClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const target = event.target as SVGElement;
		const styles = getComputedStyle(target);

		if (target.tagName !== 'rect' && target.tagName !== 'polygon') {
			return;
		}

		if (!target.hasAttribute('data-id')) {
			setCount((prev) => prev + 1);
			target.setAttribute('data-id', `${count}`);
			target.setAttribute('data-color', styles.fill!);
			target.setAttribute('data-data', JSON.stringify({ id: count, text: `SOME company -${count}` }));
			// setTargets((prev) => [
			// 	...prev,
			// 	{
			// 		target: target,
			// 		index: count,
			// 	},
			// ]);
		}
		setData({
			id: target.getAttribute('data-id'),
			isOpen: false,
		});
		setId(target.getAttribute('data-id') ?? '');
		setIsOpen(true);

		target.style.fill = darkenColor(styles.fill!, 10);
		const bbox = (target as SVGRectElement | SVGPolygonElement).getBBox();

		const svg = target.parentNode;
		if (svg) {
			const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			textElement.setAttribute('x', `${bbox.x + bbox.width / 2}`);
			textElement.setAttribute('y', `${bbox.y + bbox.height / 2}`);
			textElement.setAttribute('font-size', '22');
			textElement.setAttribute('fill', 'black');
			textElement.setAttribute('data-id-text', `${target.getAttribute('data-id')}`);
			textElement.textContent = `${target.getAttribute('data-id')}`;

			svg.appendChild(textElement);
		}
	};
	const handleSvgClickTwo = (event: React.MouseEvent<HTMLDivElement>) => {
		const target = event.target as SVGElement;
		console.log(target);
	};

	useEffect(() => {
		const el = ref.current?.querySelector('svg');
		const e = el?.querySelector(`[data-id="${id}"]`) as SVGAElement;

		if (!isOpen) {
			if (e) {
				e.style.fill = e.getAttribute('data-color')!;
			}
		}
	}, [id, ref, isOpen]);

	useEffect(() => {
		const el = ref.current?.querySelector('svg');
		const e = el?.querySelector(`[data-id="${id}"]`) as SVGAElement | SVGPolygonElement;
		if (!isOpen) {
			if (el) {
				const bbox = (e as SVGAElement | SVGPolygonElement).getBBox();
				const styles = getComputedStyle?.(e);
				e?.addEventListener('mouseenter', (event) => {
					e.style.fill = darkenColor(styles.fill!, 10);
					const parent = el.getBoundingClientRect();
					const rect = e.getBoundingClientRect();

					const relativeX = rect.left - parent.left;
					const relativeY = rect.top - parent.top;

					const textElementData = el.querySelector(`[data-id-text="${e.getAttribute('data-id')}"]`) as SVGAElement;
					textElementData?.remove();

					setPosition({
						x: `${relativeX}`,
						y: `${relativeY}`,
						width: `${rect.width}`,
						height: `${rect.height}`,
					});
					setIsShowPopup(true);
				});

				e?.addEventListener('mouseleave', (event) => {
					console.log(event.target);
					setIsShowPopup(false);
					e.style.fill = e.getAttribute('data-color')!;

					const element = el.querySelector(`[data-id-hover="${el.getAttribute('data-id')}"]`) as SVGAElement;
					const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
					textElement.setAttribute('x', `${bbox.x + bbox.width / 2}`);
					textElement.setAttribute('y', `${bbox.y + bbox.height / 2}`);
					textElement.setAttribute('font-size', '22');
					textElement.setAttribute('fill', 'black');
					textElement.setAttribute('data-id-text', `${e.getAttribute('data-id')}`);
					textElement.textContent = `${e.getAttribute('data-id')}`;

					el.appendChild(textElement);
					element?.remove();
				});
			}
		}
	}, [id, ref, isOpen]);
	return (
		<div className="flex flex-col items-center justify-start bg-slate-300 h-full w-full relative">
			<input type="file" onChange={onChange} />
			{isOpen && (
				<div className="absolute w-full h-full  flex items-center justify-center z-[9999999] ">
					<div className="absolute  bg-red-400 w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						{data.isOpen && <div>some</div>}
						{data.id}
						<button
							onClick={() => {
								setIsOpen(false);
							}}
						>
							close
						</button>
					</div>
				</div>
			)}
			<button
				onClick={() => {
					setSvgContentTwo(ref?.current?.getHTML());
					// console.log(
					// 	JSON.stringify({
					// 		html: refCopy?.current?.getHTML(),
					// 	})
					// );
					console.log(ref?.current?.getHTML());
				}}
			>
				button
			</button>
			<div className="flex  gap-4 h-screen flex-col w-screen">
				<div className=" border border-red-400 relative">
					<div
						className="relative"
						ref={ref}
						dangerouslySetInnerHTML={{ __html: svgContent! }}
						onClick={handleSvgClick}
					/>
					{isShowPopup && (
						<span
							style={{
								left: `${position?.x}px`,
								top: `${position?.y}px`,
								width: `${position?.width}px`,
								height: `${position?.height}px`,
							}}
							className={`absolute text-[20px] text-white  font-semibold  z-[1000] flex items-center justify-center p-10 `}
						>
							1
						</span>
					)}
				</div>

				<div className="w-screen h-screen border border-red-400">
					<div dangerouslySetInnerHTML={{ __html: svgContentTwo! }} onClick={handleSvgClickTwo} />
				</div>
			</div>
		</div>
	);
}

export default App;
