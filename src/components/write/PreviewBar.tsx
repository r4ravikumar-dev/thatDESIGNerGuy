import {HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

/** A strip over the preview, so it's never mistaken for the live page. */
export function PreviewBar({id, status}: {id: string; status: string}) {
  return (
    <HStack className="studio-bar preview-bar" justify="between" vAlign="center" gap={4}>
      <Text type="supporting" style={EYEBROW_STYLE}>
        Preview · {status === 'published' ? 'Live' : 'Draft, not on the site yet'}
      </Text>
      <Button label="Back to editing" size="sm" variant="secondary" href={`/write/${id}`} />
    </HStack>
  );
}
