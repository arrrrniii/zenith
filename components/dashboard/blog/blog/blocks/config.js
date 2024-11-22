import { 
  Heading,
  Type,
  Image,
  FileVideo,
  Quote,
  ListPlus,
  Columns,
  Link,
  Table,
  Code,
  Youtube,
  Instagram,
  MessageSquare
} from 'lucide-react';

export const BLOCK_CATEGORIES = {
  basic: {
    label: 'Basic',
    description: 'Essential content blocks'
  },
  media: {
    label: 'Media',
    description: 'Images, videos and other media'
  },
  layout: {
    label: 'Layout',
    description: 'Structure your content'
  },
  interactive: {
    label: 'Interactive',
    description: 'Engaging elements'
  },
  social: {
    label: 'Social',
    description: 'Social media embeds'
  },
  forms: {
    label: 'Forms',
    description: 'Interactive form elements'
  }
};

export const BLOCKS_CONFIG = [
  {
    id: 'heading',
    icon: Heading,
    label: 'Heading',
    category: 'basic',
    description: 'Section title or subtitle',
    defaultContent: { 
      text: 'New Heading', 
      level: 'h2',
      align: 'left'
    }
  },
  {
    id: 'text',
    icon: Type,
    label: 'Text Block',
    category: 'basic',
    description: 'Regular paragraph text',
    defaultContent: { 
      text: 'New text block',
      align: 'left'
    }
  },
  {
    id: 'image',
    icon: Image,
    label: 'Image',
    category: 'media',
    description: 'Single image with caption',
    defaultContent: { 
      url: '', 
      alt: '', 
      caption: '',
      width: 'full'
    }
  },
  {
    id: 'video',
    icon: FileVideo,
    label: 'Video',
    category: 'media',
    description: 'Self-hosted video player',
    defaultContent: { 
      url: '', 
      title: '',
      autoplay: false,
      controls: true
    }
  },
  {
    id: 'youtube',
    icon: Youtube,
    label: 'YouTube',
    category: 'social',
    description: 'YouTube video embed',
    defaultContent: {
      videoId: '',
      title: '',
      autoplay: false,
      muted: true,
      controls: true,
      loop: false,
      aspectRatio: '16:9',
      width: 'full',
      showRelated: false
    }
  },
  {
    id: 'quote',
    icon: Quote,
    label: 'Quote',
    category: 'basic',
    description: 'Highlighted quote or testimonial',
    defaultContent: { 
      text: '', 
      author: '',
      role: ''
    }
  },
  {
    id: 'list',
    icon: ListPlus,
    label: 'List',
    category: 'basic',
    description: 'Bullet or numbered list',
    defaultContent: { 
      items: ['New item'],
      type: 'bullet'
    }
  },
  {
    id: 'columns',
    icon: Columns,
    label: 'Columns',
    category: 'layout',
    description: 'Multi-column layout',
    defaultContent: { 
      columns: [
        { 
          blocks: [], 
          styles: {
            backgroundColor: 'transparent',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem'
          }
        },
        { 
          blocks: [], 
          styles: {
            backgroundColor: 'transparent',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem'
          }
        }
      ],
      gap: '4',
      layout: 'equal',
      customWidths: ['1fr', '1fr']
    },
    allowsNesting: true
  },
  {
    id: 'button',
    icon: Link,
    label: 'Button',
    category: 'interactive',
    description: 'Call-to-action button',
    defaultContent: {
      text: 'Click me',
      url: '',
      variant: 'primary'
    }
  },
  {
    id: 'table',
    icon: Table,
    label: 'Table',
    category: 'basic',
    description: 'Data in table format',
    defaultContent: {
      headers: ['Column 1', 'Column 2'],
      rows: [['', '']]
    }
  },
  {
    id: 'code',
    icon: Code,
    label: 'Code',
    category: 'basic',
    description: 'Code snippet with syntax highlighting',
    defaultContent: {
      code: '',
      language: 'javascript'
    }
  },
  {
    id: 'form',
    icon: MessageSquare,
    label: 'Form',
    category: 'forms',
    description: 'Add a dynamic form',
    defaultContent: {
      formType: 'contact',
      formId: `form-${Date.now()}`,
      title: 'Contact Us',
      description: 'Get in touch with us',
      submitButtonText: 'Send Message',
      recipientEmail: '',
      enableRecaptcha: true,
      successTitle: 'Thank you for your message!',
      successMessage: "We'll get back to you as soon as possible.",
      showResetButton: true,
      fields: [
        {
          id: `field-${Date.now()}-1`,
          type: 'text',
          label: 'Name',
          placeholder: 'Your name',
          required: true,
          enabled: true,
          width: 'full',
          helpText: '',
        },
        {
          id: `field-${Date.now()}-2`,
          type: 'email',
          label: 'Email',
          placeholder: 'Your email address',
          required: true,
          enabled: true,
          width: 'full',
          helpText: "We'll never share your email with anyone else.",
        },
        {
          id: `field-${Date.now()}-3`,
          type: 'tel',
          label: 'Phone',
          placeholder: 'Your phone number',
          required: false,
          enabled: true,
          width: 'full',
          helpText: 'Optional',
        },
        {
          id: `field-${Date.now()}-4`,
          type: 'select',
          label: 'Subject',
          placeholder: 'Select a subject',
          required: true,
          enabled: true,
          width: 'full',
          options: [
            'General Inquiry',
            'Support',
            'Feedback',
            'Other'
          ],
          helpText: 'What is your message about?',
        },
        {
          id: `field-${Date.now()}-5`,
          type: 'textarea',
          label: 'Message',
          placeholder: 'Your message',
          required: true,
          enabled: true,
          width: 'full',
          rows: 4,
          helpText: 'Please provide as much detail as possible',
        }
      ],
      styles: {
        backgroundColor: 'transparent',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '2xl',
        gap: '4'
      },
      validation: {
        emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        phonePattern: '^\\+?[\\d\\s-]{8,}$',
        minMessageLength: 10,
        maxMessageLength: 1000
      },
      notifications: {
        success: {
          title: 'Success!',
          message: 'Your message has been sent successfully.'
        },
        error: {
          title: 'Error',
          message: 'There was a problem sending your message. Please try again.'
        }
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0'
      }
    }
  },
  {
    id: 'instagram',
    icon: Instagram,
    label: 'Instagram',
    category: 'social',
    description: 'Instagram post embed',
    defaultContent: {
      postUrl: ''
    }
  }
];

export const getBlockConfig = (blockType) => {
  return BLOCKS_CONFIG.find(block => block.id === blockType);
};