import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { PageLayout, PageHeader } from '../components/design-system'
import { Stack } from '../components/design-system'

export default function MemorabiliPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <PageLayout>
      <Stack spacing="lg">
        <PageHeader
          title="📝 Memorabilia"
          subtitle={`Capture your experience at ${slug}`}
        />
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Capture Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="md">
              <div>
                <Label htmlFor="opener-guess">Opener Guess</Label>
                <Input 
                  id="opener-guess"
                  placeholder="Who do you think will open?"
                />
              </div>
              
              <div>
                <Label htmlFor="peak-moment">Peak Moment</Label>
                <Textarea 
                  id="peak-moment"
                  rows={3}
                  placeholder="What was the peak moment of the night?"
                />
              </div>
              
              <div>
                <Label htmlFor="song-night">Song of the Night</Label>
                <Input 
                  id="song-night"
                  placeholder="Which song hit different?"
                />
              </div>
              
              <div>
                <Label htmlFor="crowd-energy">Crowd Energy</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select energy level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chill">Chill</SelectItem>
                    <SelectItem value="hyped">Hyped</SelectItem>
                    <SelectItem value="frenzy">Frenzy</SelectItem>
                    <SelectItem value="transcendent">Transcendent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full mt-4">
                Save Memories
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </PageLayout>
  )
}
