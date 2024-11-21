// components/admin/dashboard/service/blocks/components/BasicDetailsTab/index.jsx
import { ServiceTitle } from './ServiceTitle';
import { ServiceTitleTag } from './ServiceTitleTag';
import { UrlSlug } from './UrlSlug';
import { Description } from './Description';
import { Keywords } from './Keywords';
import { ThumbnailUpload } from './ThumbnailUpload';
import { SearchPreview } from './SearchPreview';

export const BasicDetailsTab = ({
  formData,
  onChange,
  onImageUpload,
  imagePreview
}) => (
  <div className="h-full overflow-y-auto p-6">
    <div className="max-w-2xl mx-auto space-y-6">
      <ServiceTitle
        title={formData.title}
        onChange={onChange}
      />

      <ServiceTitleTag
        titletag={formData.titletag}
        onChange={onChange}
      />

      <UrlSlug
        slug={formData.slug}
        title={formData.title}
        onChange={onChange}
      />
   
      <Description
        description={formData.description}
        onChange={onChange}
      />
      <Keywords
        keywords={formData.keywords}
        onChange={onChange}
      />
      <ThumbnailUpload
        imagePreview={imagePreview}
        onImageUpload={onImageUpload}
      />
      <SearchPreview formData={formData} />
    </div>
  </div>
);