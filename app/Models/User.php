<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use LdapRecord\Laravel\Auth\AuthenticatesWithLdap;
use LdapRecord\Laravel\Auth\LdapAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements LdapAuthenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    use AuthenticatesWithLdap;

    protected $table = 'users';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'username',
        'password',
        'syst_pole_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the pole that the user belong.
     */
    public function pole(): BelongsTo
    {
        return $this->belongsTo(SystPole::class, 'syst_pole_id');
    }

    /**
     * The systems that belong to the user.
     */
    public function systems(): BelongsToMany
    {
        return $this->belongsToMany(SystSubsystem::class,'users_systems','user_id','system_id');
    }

     /**
     * The projects that belong to the user.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(SystStructureProject::class, 'users_projects','user_id','project_id');
    }
    
}
