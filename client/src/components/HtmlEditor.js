import React from "react";
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/imageResize', ImageResize);

const HTMLEditor = props => {
  const modules = {
   toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  };
 
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'script', 'indent', 'direction',
    'color', 'background',
    'font',
    'align',
    'link', 'image', 'clean'
  ];

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      value={props.value || ""}
      onChange={props.onChange}
    />
  );
}

export default HTMLEditor;
