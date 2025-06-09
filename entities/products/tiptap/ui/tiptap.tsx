'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import Underline from '@tiptap/extension-underline'
import Code from '@tiptap/extension-code'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, CodeIcon, Italic, List, ListOrdered, Quote, Strikethrough, UnderlineIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'


const Tiptap = ({ val }: {val: string}) => {
	const searchParams = useSearchParams();
	const editMode = searchParams.get('id');
	const [formatValues, setFormatValues] = useState<string[]>([]);
	const { setValue } = useFormContext();
  const editor = useEditor({
		editorProps: {
			attributes: {
				class: "min-h-[80px] file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input  w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
			}
		},
    extensions: [			
			StarterKit.configure({
				bulletList: false,
				orderedList: false,
				listItem: false,
			}),
			Placeholder.configure({
				placeholder: 'Add a longer description for your product',
				emptyNodeClass:'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-1 before:left-3 before:text-mauve-11 leading-normal before:opacity-50 before-pointer-events-none',
			}),
			Underline,
			Code,
			Blockquote.configure({
				HTMLAttributes: {
					class: "border-l-4 border-gray-300 pl-4 italic text-muted-foreground",
				},
			}),
			BulletList.configure({
				HTMLAttributes: {
					class: "list-disc pl-5 mb-2 text-sm text-foreground",
				},
			}),
			OrderedList.configure({
				HTMLAttributes: {
					class: "list-decimal pl-5 mb-2 text-sm text-foreground",
				},
			}),
			ListItem,
		],
		onUpdate: ({editor}) => {
			const content = editor.getHTML();
			setValue("description", content, {
				shouldValidate: true,
				shouldDirty: true,
			});
		},
    content: val,
		immediatelyRender: false,
  })

	const formatCommandMap: Record<string, (editor: Editor) => void> = {
		bold: (editor) => editor.chain().focus().toggleBold().run(),
		italic: (editor) => editor.chain().focus().toggleItalic().run(),
		underline: (editor) => editor.chain().focus().toggleUnderline().run(),
		strikethrough: (editor) => editor.chain().focus().toggleStrike().run(),
		code: (editor) => editor.chain().focus().toggleCode().run(),
		blockquote: (editor) => editor.chain().focus().toggleBlockquote().run(),
		unordered: (editor) => editor.chain().focus().toggleBulletList().run(),
		ordered: (editor) => editor.chain().focus().toggleOrderedList().run(),
	}
	
	const toggleFormat = (format: string) => {
		if (!editor) return
		const command = formatCommandMap[format]
		if (command) command(editor)
	}
	
	const handleToggle = (newValue: string[]) => {
		const added = newValue.filter((val) => !formatValues.includes(val))
		const removed = formatValues.filter((val) => !newValue.includes(val))
	
		added.forEach(toggleFormat)
		removed.forEach(toggleFormat)
	
		setFormatValues(newValue)
	}

  useEffect(() => {
    if (!editor) return

    const updateActiveMarks = () => {
      const active: string[] = []
      if (editor.isActive('bold')) active.push('bold')
      if (editor.isActive('italic')) active.push('italic')
      if (editor.isActive('strike')) active.push('strikethrough')
      if (editor.isActive('underline')) active.push('underline')
      if (editor.isActive('code')) active.push('code')
      if (editor.isActive('blockquote')) active.push('blockquote')
			if (editor.isActive('bulletList')) active.push('unordered')
			if (editor.isActive('orderedList')) active.push('ordered')
			setFormatValues(active)
    }

    editor.on('selectionUpdate', updateActiveMarks)
    editor.on('transaction', updateActiveMarks)

    return () => {
      editor.off('selectionUpdate', updateActiveMarks)
      editor.off('transaction', updateActiveMarks)
    }
  }, [editor])

	useEffect(() => {
		if (editor && !editMode) {
			editor.commands.clearContent()
		}
	}, [editor, editMode])

	useEffect(() => {
		if (editor?.isEmpty) {
			editor.commands.setContent(val)
		}
	}, [editor, val])

  return (
		<div>
			<ToggleGroup variant="outline" type="multiple" size="sm" className='mb-2' value={formatValues} onValueChange={handleToggle}>
				<ToggleGroupItem value="bold" aria-label="Bold">
					<Bold className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="italic" aria-label="Italic">
					<Italic className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="underline" aria-label="Underline">
					<UnderlineIcon className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="strikethrough" aria-label="Strikethrough">
					<Strikethrough className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="code" aria-label="Code">
					<CodeIcon className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="blockquote" aria-label="Blockquote">
					<Quote className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="unordered" aria-label="Bullet List">
					<List className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="ordered" aria-label="Ordered List">
					<ListOrdered className="h-4 w-4" />
				</ToggleGroupItem>
			</ToggleGroup>
			<EditorContent editor={editor}/>
		</div>
	)
}

export default Tiptap
