import { useParams } from 'react-router-dom'

export default function MemorabiliPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Memorabilia</h1>
      <div className="space-y-6">
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📝 Capture Your Experience</h2>
          <p className="text-muted-foreground mb-4">Event: {slug}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Opener Guess</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Who do you think will open?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Peak Moment</label>
              <textarea 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                rows={3}
                placeholder="What was the peak moment of the night?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Song of the Night</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Which song hit different?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Crowd Energy</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                <option value="">Select energy level...</option>
                <option value="Chill">Chill</option>
                <option value="Hyped">Hyped</option>
                <option value="Frenzy">Frenzy</option>
                <option value="Transcendent">Transcendent</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
